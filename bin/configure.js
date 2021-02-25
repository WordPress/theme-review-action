const fs = require('fs');
const execa = require('execa');
const ora = require('ora');
const Log = require('./log');

const CLI_ARGUMENTS = ['run', 'wp-env', 'run', 'cli'];
const TEST_CLI_ARGUMENTS = ['run', 'wp-env', 'run', 'tests-cli'];
let spinner;

const getTimeOutput = (str, startTime) => {
	return `${str} (${(Date.now() - startTime) / 1000}s)`;
};

/**
 * Runs a command synchronously
 * @param {string} str Will be output to the console
 * @param {string} args Arguments pass to npm
 */
const runCommand = async (str, args, defaultArguments = TEST_CLI_ARGUMENTS) => {
	const startTime = Date.now();
	spinner = ora(str).start();
	const res = await execa('npm', [...defaultArguments, args], { cmd: '../' });

	console.log(res);

	spinner.succeed(getTimeOutput(str, startTime));
	return res;
};

/**
 * Conditionally installs a menu for testing
 */
const installMenu = async () => {
	const menuArgs = 'wp menu location list --format=csv';

	const { stdout } = await runCommand(
		'Checking for a registered nav menu.',
		menuArgs
	);

	try {
		const [, menus] = stdout.split('location,description');
		const menuId = menus.trim().split('\n')[0].split(',')[0];

		await runCommand(
			`Installing menu '${menuId}' to 'All Pages'.`,
			`wp menu location assign "All Pages" ${menuId}`
		);
	} catch (e) {
		spinner.info("Theme doesn't include any registered menus.");
	}
};

const downloadAndSaveFile = ({ lib, url, text, saveTo }) => {
	return new Promise((resolve, reject) => {
		const startTime = Date.now();
		spinner = ora(text).start();
		lib.get(url, (res) => {
			if (res.statusCode !== 200) {
				reject('Error downloading file');
			}

			let rawData = '';
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				rawData += chunk;
			}).on('end', () => {
				try {
					fs.writeFileSync(saveTo, rawData);
					spinner.succeed(getTimeOutput(text, startTime));
					resolve('done');
				} catch (e) {
					spinner.fail();
					reject(e.message);
				}
			});
		});
	});
};

/**
 * Downloads a database export from github
 */
const downloadTestData = async () => {
	const url =
		'https://raw.githubusercontent.com/wpaccessibility/a11y-theme-unit-test/master/a11y-theme-unit-test-data.xml';
	await downloadAndSaveFile({
		lib: require('https'),
		url,
		text: `Downloading test data xml from ${url}.`,
		saveTo: 'config/a11y-theme-unit-test-data.xml',
	});
};

/**
 * Downloads information about the theme
 */
const downloadSiteData = async () => {
	const port = process.env.WP_ENV_TESTS_PORT || 8889;
	const url = `http://localhost:${port}/?rest_route=/theme-test-helper/v1/info`;

	await downloadAndSaveFile({
		lib: require('http'),
		url,
		text: `Downloading site data from ${url}.`,
		saveTo: 'config/siteinfo.json',
	});
};

/**
 * Downloads test data, install importer and imports the test data
 */
const importTestData = async () => {
	await downloadTestData();

	await runCommand(
		'Installing & Activating wordpress-importer.',
		'plugin install wordpress-importer --activate'
	);

	await runCommand(
		'Importing a11y data.',
		'import config/a11y-theme-unit-test-data.xml --authors=create --quiet'
	);
};

(async () => {
	try {
		await runCommand(
			'Activating the test theme on main site.',
			'theme activate test-theme',
			CLI_ARGUMENTS
		);

		await runCommand(
			'Activating the test theme on test site.',
			'theme activate test-theme'
		);

		await importTestData();

		await installMenu();

		await downloadSiteData();

		Log.success('Installation complete.');
	} catch (e) {
		spinner.stop();
		console.log(e);
	}
})();
