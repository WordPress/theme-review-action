#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const program = require('commander');
const ora = require('ora');
const core = require('@actions/core');
const { command } = require('execa');
const { info, error: errorToLog, success, print, warning } = require('./log');
const {
	fancyTimeFormat,
	isWindows,
	getThemeType,
	createLogs,
} = require('./utils');

const UTF_8_ENCODING = { encoding: 'UTF-8' };
const DEFAULT_TIMEOUT = 300 * 1000;
const LOG_PATH = path.join(__dirname, '../logs');
const ACTIONS_PATH = path.join(__dirname, '../actions');

/**
 * Loads this projects package.json to get the version number
 */
const getVersion = () => {
	const packageJsonLocation = path.join(__dirname, `../package.json`);
	const file = fs.readFileSync(packageJsonLocation, UTF_8_ENCODING);

	return JSON.parse(file).version;
};

/**
 * Loads the theme's style.css to retrieve theme information
 */
const getThemeInfo = () => {
	const destination = path.join(__dirname, `../test-theme`);
	const file = fs.readFileSync(`${destination}/style.css`, UTF_8_ENCODING);
	let themeName;

	if (file) {
		const themeNameRegEx = /Theme Name:(.+)/gim;
		const match = themeNameRegEx.exec(file);

		if (!match) {
			throw Error('Not able to locate your style.css');
		}

		themeName = match[1].trim();
	}

	return {
		themeName,
	};
};

/**
 * Determines whether the host system is running a docker instance
 */
const hasDocker = async () => {
	// TODO: Improve the docker check to be cross platform.
	if (isWindows()) {
		warning('Please ensure docker is running.');
		return true;
	}

	try {
		// TODO: This won't work on windows
		const res = await command(
			'curl --unix-socket /var/run/docker.sock http:/ping'
		);

		const error = JSON.parse(res.stdout);

		if (error.message === 'page not found') {
			return true;
		}
	} catch (e) {
		if (Number(e.exitCode) === 7) {
			return false;
		}
	}

	return false;
};

/**
 * Prints information about the test run
 * @param {number} elapsedTime
 */
const printTestRunInfo = ({ elapsedTime, themeName }) => {
	success(`\n\nSuccessfully ran test suite on "${themeName}".`);
	info(`Elapsed Time: ${fancyTimeFormat(elapsedTime)}s\n`);
};

const printDebugInfo = (input) => {
	if (program.debug) {
		info('\nDebug Info:\n');
		print(input);
	}
};

/**
 * Returns timeout as a number
 */
const getTimeout = () => {
	let timeout = +program.timeout;

	// wp-env takes more time on windows, increase the timeout if it hasn't been set.
	if (timeout === DEFAULT_TIMEOUT && isWindows()) {
		timeout = timeout + 100000;
	}

	return timeout;
};

/**
 * Prints information about the test environment
 */
const printTestHeader = ({ basePort, testPort }) => {
	try {
		info('\nTest Version:', getVersion());
	} catch (e) {
		errorToLog('Could not retrieve package version.');
	}

	info('Testing Ports:', [basePort, testPort].join('/'));
};

const withSpinner = async (str, fn) => {
	let spinner = ora(str).start();
	let time = process.hrtime();

	try {
		await fn();
		time = process.hrtime(time);

		spinner.succeed(
			`${str} (in ${time[0]}s ${(time[1] / 1e6).toFixed(0)}ms)`
		);

		return {
			success: true,
		};
	} catch (ex) {
		spinner.fail();
		return {
			error: ex,
		};
	}
};

const runThemeCopyAsync = async (pathToCopy) => {
	const { error } = await withSpinner(
		'Copying theme files into the environment...',
		async () => {
			const destination = path.join(__dirname, `../test-theme`);
			const res = await fs.copy(pathToCopy, destination);
			printDebugInfo(res);
		}
	);

	if (error) {
		errorToLog(error);
		printDebugInfo(error);
		return false;
	}
};

const runEnvironmentSetupAsync = async (npmPrefix, env) => {
	const { success, error } = await withSpinner(
		'Setting up the development environment for testing...',
		async () => {
			const res = await command(`${npmPrefix} install:environment `, {
				env,
				windowHide: false,
				timeout: getTimeout(),
			});
			printDebugInfo(res);
		}
	);

	if (success) {
		return true;
	}

	if (error) {
		errorToLog(error);
		printDebugInfo(error);
		return false;
	}
};

const runStructureCheckAsync = async (npmPrefix, env) => {
	const { success, error } = await withSpinner(
		"Checking theme's basic structure",
		async () => {
			const res = await command(`${npmPrefix} check:structure`, {
				env,
				timeout: getTimeout(),
			});
			printDebugInfo(res);
		}
	);

	if (success) {
		return true;
	}

	if (error) {
		errorToLog(error);
		printDebugInfo(error);
		return false;
	}
};

const runThemeCheckAsync = async (npmPrefix) => {
	const { success, error } = await withSpinner(
		'Running the theme through theme check plugin...',
		async () => {
			const res = await command(`${npmPrefix} check:theme-check`, {
				timeout: getTimeout(),
			});

			printDebugInfo(res);
		}
	);

	if (success) {
		return true;
	}

	if (error) {
		errorToLog(error);
		printDebugInfo(error);
		return false;
	}
};

const runUICheckAsync = async (npmPrefix, env) => {
	const { success, error } = await withSpinner(
		'Running some end to end tests on the front end...',
		async () => {
			const res = await command(`${npmPrefix} check:ui`, {
				env,
				timeout: getTimeout(),
			});

			printDebugInfo(res);
		}
	);

	if (success) {
		return true;
	}

	if (error) {
		errorToLog(error);
		printDebugInfo(error);
		if (error.timedOut) {
			errorToLog('TIMED OUT');
		}
		return false;
	}
};

const runTearDownAsync = async (npmPrefix) => {
    const { success, error } = await withSpinner(
	'Tearing down the environment...',
    async () => {
        const res = await command(`${npmPrefix} wp-env destroy`, {
			input: 'y',
			timeout: getTimeout(),
		});

		printDebugInfo(res);
    });

	if (success) {
		return true;
	}

	if (error) {
		errorToLog(error);
		printDebugInfo(error);

		return false;
	}
};

const verifyFilesAsync = async () => {
	let spinner = ora('Checking for files...').start();
	try {
		const testFolderLocation = path.join(__dirname, `../test-theme`);
		const files = fs.readdirSync(testFolderLocation);

		if (!files.length) {
			throw errorToLog();
		}
		spinner.succeed('Using existing files in ./test-theme');
		return true;
	} catch (e) {
		printDebugInfo(e);
		spinner.fail(
			'No files found: Please copy your theme into the "test-theme" folder, or add the relative path to your theme via using the program options. Ie "npm run start -- --pathToTheme=../my-theme"'
		);
		return false;
	}
};

const printTestResultBlock = (logFunction, text, logPath) => {
	try {
		const contents = fs.readFileSync(logPath, UTF_8_ENCODING).trim();
		if (contents.length > 0) {
			logFunction(`${text}${contents}`);
		}
	} catch (e) {
		printDebugInfo(e);
	}
};

const printTestResults = () => {
	try {
		const errorFunction = program.githubRun ? core.setFailed : errorToLog;
		const warningFunction = program.githubRun ? core.warning : warning;

		printTestResultBlock(
			errorFunction,
			'\nStructure Check Errors:\n\n',
			`${LOG_PATH}/structure-check-errors.txt`
		);

		printTestResultBlock(
			warningFunction,
			'\nStructure Check Warnings:\n\n',
			`${LOG_PATH}/structure-check-warnings.txt`
		);

		printTestResultBlock(
			errorFunction,
			'\nTheme Check Errors:\n\n',
			`${LOG_PATH}/theme-check-errors.txt`
		);

		printTestResultBlock(
			warningFunction,
			'\nTheme Check Warnings:\n\n',
			`${LOG_PATH}/theme-check-warnings.txt`
		);

		printTestResultBlock(
			errorFunction,
			'\nUser Interface Errors:\n\n',
			`${LOG_PATH}/ui-check-errors.txt`
		);

		printTestResultBlock(
			warningFunction,
			'\nUser Interface Warnings:\n\n',
			`${LOG_PATH}/ui-check-warnings.txt`
		);

		return true;
	} catch (e) {
		errorToLog(e);
		return false;
	}
};

/**
 * Executes the program
 */
async function run() {
	let themeInfo;

	const startTime = Date.now(); // Used to determine test duration
	const rootPath = path.join(__dirname, '../');

	// Ports used by wp-env
	const basePort = Number(program.port);
	const testPort = basePort + 1;

	// This make sure npm is running the correct command (the ones in this repo)
	// Adding a prefix on windows caused it to hang.
	const npmPrefix = isWindows() ? 'npm run' : `npm run --prefix ${rootPath}`;

	// We need docker, if they don't have it return
	if (!(await hasDocker())) {
		errorToLog('This project requires Docker to be installed and running.');
		return;
	}

	printTestHeader({
		basePort,
		testPort,
	});

	info('\nSteps:');

	if (!program.githubRun) {
		fs.emptyDirSync(LOG_PATH);
		createLogs(ACTIONS_PATH, LOG_PATH, false);
	}

	// Having a path set takes precedent over skipping the copy which is the local default
	if (!program.skipFolderCopy || program.pathToTheme !== '.') {
		await runThemeCopyAsync(program.pathToTheme);
	} else {
		await verifyFilesAsync();
	}

	const hasBasicStructure = await runStructureCheckAsync(npmPrefix, {
		WP_THEME_TYPE: getThemeType(),
	});

	if (!hasBasicStructure) {
		printTestResults();
		return;
	}

	let hasWorkingEnvironment = await runEnvironmentSetupAsync(npmPrefix, {
		WP_ENV_PORT: basePort,
		WP_ENV_TESTS_PORT: testPort,
		CI: program.githubRun,
	});

	// Only try tests if the environment succeeded
	if (hasWorkingEnvironment) {
		await runThemeCheckAsync(npmPrefix);

		await runUICheckAsync(npmPrefix, {
			TEST_ACCESSIBILITY: program.accessibleReady,
			WP_ENV_TESTS_PORT: testPort,
			WP_THEME_TYPE: getThemeType(),
			CI: program.githubRun,
			UI_DEBUG: program.UIDebug,
		});
	}

	await runTearDownAsync(npmPrefix);

	if (hasWorkingEnvironment) {
		printTestResults();

		try {
			themeInfo = getThemeInfo();
		} catch (e) {
			errorToLog(e.message);
			return;
		}

		printTestRunInfo({
			themeName: themeInfo.themeName,
			elapsedTime: (Date.now() - startTime) / 1000,
		});
	}
}

(async () => {
	try {
		program
			.version(getVersion())
			.option(
				'--accessibleReady <boolean>',
				'runs more in-depth accessibility tests.',
				false
			)
			.option('--debug', 'prints more debug information.', false)
			.option(
				'--port <port>',
				'port to run tests on. Tests require 2 ports. Tests will also occupy <port> +1.',
				8484
			)
			.option('--pathToTheme <path>', 'relative path to theme.', '.')
			.option(
				'--timeout <ms>',
				'sets timeout for each step.',
				DEFAULT_TIMEOUT
			)
			.option('--skipFolderCopy', 'skips folder copy step.', false)
			.option(
				'--UIDebug',
				'saves screenshots in ui check (NPX triggered runs are not supported)',
				false
			)
			.option(
				'--githubRun',
				'whether the test is running on github.',
				false
			)
			.action(run);

		await program.parseAsync(process.argv);
	} catch (e) {
		errorToLog(e);
		errorToLog('We ran into an error with the test framework.');
	}
})();
