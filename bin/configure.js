const https = require('https');
const fs = require('fs');
const execa = require('execa');
const ora = require('ora');

const CLI_ARGUMENTS = ['run', 'wp-env', 'run', 'cli'];
const TEST_CLI_ARGUMENTS = ['run', 'wp-env', 'run', 'tests-cli'];
let spinner;

/**
 * Runs a command synchronously
 * @param {string} str Will be output to the console
 * @param {string} args Arguments pass to npm
 */
const runCommand = async (str, args, defaultArguments = TEST_CLI_ARGUMENTS) => {
	spinner = ora(str).start();
	const res = await execa('npm', [...defaultArguments, args], { cmd: '../' });
	spinner.succeed();
	return res;
};

/**
 * Conditionally installs a menu for testing
 */
const installMenu = async () => {
	const menuArgs =
		'wp menu location list --format=csv | tail -n +2 | head -n 1 | cut -d, -f1';

	const { stdout } = await runCommand(
		'Checking for a registered nav menu.',
		menuArgs
	);

	// Split response to find menu-id
	const [, menuId] = stdout.split(menuArgs);

	if (menuId && menuId.length) {
		const cleanedId = menuId.replace(/(\r\n|\n|\r|\")/gm, '');
		await runCommand(
			'Installing menu.',
			`wp menu location assign 'All Pages' ${cleanedId}`
		);
	} else {
		spinner.info("Theme doesn't include any registered menus.");
	}
};

/**
 * Downloads a database export from github
 */
const downloadTestData = () => {
	return new Promise((resolve, reject) => {
		spinner = ora('Downloading test data xml.').start();
		https.get(
			'https://raw.githubusercontent.com/wpaccessibility/a11y-theme-unit-test/master/a11y-theme-unit-test-data.xml',
			(res) => {
				let rawData = '';
				res.setEncoding('utf8');
				res.on('data', (chunk) => {
					rawData += chunk;
				}).on('end', () => {
					try {
						fs.writeFileSync(
							'config/a11y-theme-unit-test-data.xml',
							rawData
						);
						spinner.succeed();
						resolve('done');
					} catch (e) {
                        spinner.fail();
						reject(e.message);
					}
				});
			}
		);
	});
};

(async () => {
	try {
		await downloadTestData();

		await runCommand(
			'Activating the test theme on main site.',
			'theme activate test-theme',
			CLI_ARGUMENTS
		);

		await runCommand(
			'Activating the test theme on test site.',
			'theme activate test-theme'
		);

		await runCommand(
			'Installing & Activating wordpress-importer.',
			'plugin install wordpress-importer --activate'
		);

		await runCommand(
			'Importing a11y data.',
			'import config/a11y-theme-unit-test-data.xml --authors=create --quiet'
		);

		await installMenu();
	} catch (e) {
		console.log(e);
	}
})();
