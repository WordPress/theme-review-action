const fs = require('fs');
const path = require('path');
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
	const res = await execa('npm', [...defaultArguments, ...args.split(' ') ], { cmd: '../' });

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

// Outside the .wp-env.json mappings: a theme can symlink those and redirect this write.
const SITE_DATA_FILE = path.join(__dirname, '../site-data/siteinfo.json');

/**
 * Writes a file without following a symlink at the destination.
 *
 * @param {string} filePath Absolute path of the file to write.
 * @param {string} contents Contents to write.
 */
const writeFileNoFollow = (filePath, contents) => {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });

	// fs.writeFileSync() resolves the path; O_NOFOLLOW fails on a symlink instead of writing through it.
	const fd = fs.openSync(
		filePath,
		fs.constants.O_WRONLY |
			fs.constants.O_CREAT |
			fs.constants.O_TRUNC |
			fs.constants.O_NOFOLLOW
	);

	try {
		fs.writeFileSync(fd, contents);
	} finally {
		fs.closeSync(fd);
	}
};

const downloadAndSaveFile = ({ lib, url, text, saveTo, transform = (data) => data }) => {
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
					writeFileNoFollow(saveTo, transform(rawData));
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
 * Downloads information about the theme
 */
const downloadSiteData = async () => {
	const port = process.env.WP_ENV_TESTS_PORT || 8889;
	const url = `http://localhost:${port}/?rest_route=/theme-test-helper/v1/info`;

	await downloadAndSaveFile({
		lib: require('http'),
		url,
		text: `Downloading site data from ${url}.`,
		saveTo: SITE_DATA_FILE,
		// The submitted theme serves this route, so re-serialize it rather than storing the raw body.
		transform: (rawData) => JSON.stringify(JSON.parse(rawData)),
	});
};

/**
 * Downloads test data, install importer and imports the test data
 */
const importTestData = async () => {
	await runCommand(
		'Installing & Activating wordpress-importer.',
		'wp plugin install wordpress-importer --activate'
	);

	await runCommand(
		'Importing a11y data.',
		'wp import config/a11y-theme-unit-test-data.xml --authors=create --quiet'
	);
};

(async () => {
	try {
		await runCommand(
			'Activating the test theme on main site.',
			'wp theme activate test-theme',
			CLI_ARGUMENTS
		);

		await runCommand(
			'Activating the test theme on test site.',
			'wp theme activate test-theme'
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
