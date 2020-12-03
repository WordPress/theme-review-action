#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const program = require('commander');
const ora = require('ora');
const { command } = require('execa');
const { info, error, success, print } = require('./log');
const { fancyTimeFormat } = require('./utils');

const UTF_8_ENCODING = { encoding: 'UTF-8' };

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
	const file = fs.readFileSync('style.css', UTF_8_ENCODING);
	let themeName;

	if (file) {
		const themeNameRegEx = /Theme Name:(.+)/gim;
		const match = themeNameRegEx.exec(file);

		if (!match) {
			throw Error('Not able to locate your style.css');
		}

		themeName = match[1];
	}

	return {
		themeName,
	};
};

/**
 * Determines whether the host system is running a docker instance
 */
const hasDocker = async () => {
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
const printTestRunInfo = ({ elapsedTime }) => {
	success('\n\nSuccessfully ran test suite.');
	info(`Elapsed Time: ${fancyTimeFormat(elapsedTime)}s\n`);
};

/**
 * Prints information about the test environment
 */
const printTestHeader = ({ themeName, basePort, testPort }) => {
	try {
		info('\nTest Version:', getVersion());
	} catch (e) {
		error('Could not retrieve package version.');
	}

	info('Theme:', themeName);
	info('Testing Ports:', [basePort, testPort].join('/'));
};

/**
 * Executes the program
 */
async function run() {
	let spinner, themeInfo;

	const startTime = Date.now(); // Used to determine test duration
	const rootPath = path.join(__dirname, `../`);

	// Ports used by wp-env
	const basePort = Number(program.port);
	const testPort = basePort + 1;

	let hasWorkingEnvironment = true;

	// This make sure npm is running the correct command (the ones in this repo)
	const npmPrefix = `npm run --prefix ${rootPath}`;

	// We need docker, if they don't have it return
	if (!(await hasDocker())) {
		error('This project requires Docker to be installed and running.');
		return;
	}

	// Get theme information. If we can't load the theme information we should stop the test.
	try {
		themeInfo = getThemeInfo();
	} catch (e) {
		error(e.message);
		return;
	}

	printTestHeader({
		themeName: themeInfo.themeName,
		basePort,
		testPort,
	});

	info('\nSteps:');

	try {
		const destination = path.join(__dirname, `../test-theme`);
		spinner = ora('Copying theme files into the environment...').start();
		await fs.copy('.', destination);
		spinner.succeed();
	} catch (e) {
		error(e);
		spinner.fail();
		return;
	}

	try {
		spinner = ora(
			'Setting up the development environment for testing...'
		).start();
		await command(`${npmPrefix} install:environment`, {
			env: {
				WP_ENV_PORT: basePort,
				WP_ENV_TESTS_PORT: testPort,
			},
		});

		spinner.succeed();
	} catch (e) {
		error(e);
		spinner.fail();
		hasWorkingEnvironment = false;
	}

	// Only try test if the environment succeeded
	if (hasWorkingEnvironment) {
		try {
			spinner = ora(
				'Running the theme through theme check plugin...'
			).start();
			await command(`${npmPrefix} check:theme-check`);

			spinner.succeed();
		} catch (e) {
			spinner.fail();
		}

		try {
			spinner = ora(
				'Running some end to end tests on the front end...'
			).start();
			await command(`${npmPrefix} check:ui`, {
				env: {
					TEST_ACCESSIBILITY: program.accessibleReady,
					WP_ENV_TESTS_PORT: testPort,
					WP_USING_NPX: true
				},
			});

			spinner.succeed();
		} catch (e) {
			// We succeed here because failed tests will cause an exception. But we'll show the log later.
			spinner.succeed();
		}
	}

	try {
		spinner = ora('Tearing down the environment...').start();
		await command(`${npmPrefix} wp-env destroy`, {
			input: 'y',
		});
		spinner.succeed();
	} catch (e) {
		spinner.fail();
		error(e);
		return;
	}

	if (hasWorkingEnvironment) {
		try {
			success('\nTest Results:');

			const logPath = path.join(__dirname, '../logs');
			const themeCheckLogPath = `${logPath}/theme-check.txt`;
			const uiCheckLogPath = `${logPath}/ui-check.txt`;

			const themeCheckLog = fs.readFileSync(
				themeCheckLogPath,
				UTF_8_ENCODING
			);

			info('Theme Check Test Results:\n');
			print(themeCheckLog.trim());

			const uiCheck = fs.readFileSync(uiCheckLogPath, UTF_8_ENCODING);

			info('\nUser Interface Test Results:\n');
			print(uiCheck.trim());
		} catch (e) {
			error(e);
		}

		printTestRunInfo({
			elapsedTime: (Date.now() - startTime) / 1000,
		});
	}
}

(async () => {
	try {
		program
			.version(getVersion())
			.option(
				'--ar, --accessibleReady',
				'runs more in-depth accessibility tests.',
				false
			)
			.option(
				'--p, --port <port>',
				'port to run tests on. Tests require 2 ports. Tests will also occupy <port> +1.',
				8484
			)
			.action(run);

		await program.parseAsync(process.argv);
	} catch (e) {
		error(e);
		error('We ran into an error with the test framework.');
	}
})();
