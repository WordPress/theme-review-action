#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const program = require('commander');
const ora = require('ora');
const core = require('@actions/core');
const { command } = require('execa');
const { info, error, success, print, warning } = require('./log');
const { fancyTimeFormat, isWindows, getThemeType } = require('./utils');

const UTF_8_ENCODING = { encoding: 'UTF-8' };
const DEFAULT_TIMEOUT = 240 * 1000;

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
	const timeout = +program.timeout;

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
		error('Could not retrieve package version.');
	}

	info('Testing Ports:', [basePort, testPort].join('/'));
};

const runThemeCopyAsync = async (pathToCopy) => {
	let spinner = ora('Copying theme files into the environment...').start();

	try {
		const destination = path.join(__dirname, `../test-theme`);
		await fs.copy(pathToCopy, destination);
		spinner.succeed();
		return true;
	} catch (e) {
		error(e);
		spinner.fail();
		return false;
	}
};

const runEnvironmentSetupAsync = async (npmPrefix, env) => {
	let spinner = ora(
		'Setting up the development environment for testing...'
	).start();

	try {
		const res = await command(`${npmPrefix} install:environment `, {
			env,
			windowHide: false,
			timeout: getTimeout(),
		});

		printDebugInfo(res);

		spinner.succeed();
		return res;
	} catch (e) {
		error(e);
		spinner.fail();
		return false;
	}
};

const runThemeCheckAsync = async (npmPrefix) => {
	let spinner = ora(
		'Running the theme through theme check plugin...'
	).start();
	try {
		const res = await command(`${npmPrefix} check:theme-check`, {
			timeout: getTimeout(),
		});

		printDebugInfo(res);

		spinner.succeed();
		return res;
	} catch (e) {
		printDebugInfo(e);
		spinner.fail();
		return false;
	}
};

const runUICheckAsync = async (npmPrefix, env) => {
	let spinner = ora(
		'Running some end to end tests on the front end...'
	).start();

	try {
		const res = await command(`${npmPrefix} check:ui`, {
			env,
			timeout: getTimeout(),
		});

		printDebugInfo(res);

		spinner.succeed();
		return res;
	} catch (e) {
		printDebugInfo(e);
		// We succeed here because failed tests will cause an exception. But we'll show the log later.
		spinner.succeed();
		return false;
	}
};

const runTearDownAsync = async (npmPrefix) => {
	let spinner = ora('Tearing down the environment...').start();
	try {
		const res = await command(`${npmPrefix} wp-env destroy`, {
			input: 'y',
			timeout: getTimeout(),
		});

		printDebugInfo(res);

		spinner.succeed();
		return res;
	} catch (e) {
		printDebugInfo(e);
		spinner.fail();
		error(e);
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
		const logPath = path.join(__dirname, '../logs');
		const errorFunction = program.githubRun ? core.setFailed : error;
		const warningFunction = program.githubRun ? core.warning : warning;

		printTestResultBlock(
			errorFunction,
			'\nTheme Check Errors:\n\n',
			`${logPath}/theme-check-errors.txt`
		);

		printTestResultBlock(
			warningFunction,
			'\nTheme Check Warnings:\n\n',
			`${logPath}/theme-check-warnings.txt`
		);

		printTestResultBlock(
			errorFunction,
			'\nUser Interface Errors:\n\n',
			`${logPath}/ui-check-errors.txt`
		);

		printTestResultBlock(
			warningFunction,
			'\nUser Interface Warnings:\n\n',
			`${logPath}/ui-check-warnings.txt`
		);

		return true;
	} catch (e) {
		error(e);
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
		error('This project requires Docker to be installed and running.');
		return;
	}

	printTestHeader({
		basePort,
		testPort,
	});

	info('\nSteps:');

	if (!program.skipFolderCopy) {
		await runThemeCopyAsync(program.pathToTheme);
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
		});
	}

	await runTearDownAsync(npmPrefix);

	if (hasWorkingEnvironment) {
		printTestResults();

		try {
			themeInfo = getThemeInfo();
		} catch (e) {
			error(e.message);
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
				'--accessibleReady',
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
			.option('--timeout <ms>', 'sets timeout for each step.')
			.option('--skipFolderCopy', 'skips folder copy step.', false)
			.option(
				'--githubRun',
				'whether the test is running on github.',
				false
			)
			.action(run);

		await program.parseAsync(process.argv);
	} catch (e) {
		error(e);
		error('We ran into an error with the test framework.');
	}
})();
