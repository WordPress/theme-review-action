const fs = require('fs');
const path = require('path');
const Utils = require('./utils');

const READ_OPTIONS = { encoding: 'utf8' };

const getWpEnv = () => {
	try {
		const jsonContent = fs.readFileSync(
			path.join(__dirname, '../.wp-env.json'),
			READ_OPTIONS
		);
		return JSON.parse(jsonContent);
	} catch (e) {
		console.log('Problem retrieving .wp-env', e);
	}
	return;
};

/**
 * Creates an override config file sometimes
 */
const maybeCreateOverrideConfig = () => {
	const parentTheme = Utils.getParentTheme();
	const isBlockTheme = Utils.isBlockTheme();

	console.log('Maybe creating .wp-env override config.');

	if (!parentTheme && !isBlockTheme) {
		console.log('No need for an override.');
		return;
	}

	const configs = getWpEnv();

	if (!configs) {
		console.log('Unable to locate .wp-env');
		return;
	}

	if (parentTheme) {
		configs.themes.push(
			`https://downloads.wordpress.org/theme/${parentTheme}.zip`
		);
	}

	if (isBlockTheme) {
		configs.plugins.push(
			`https://downloads.wordpress.org/plugin/gutenberg.zip`
		);
	}

	const configString = JSON.stringify(configs);
	fs.writeFileSync(
		path.join(__dirname, '../.wp-env.override.json'),
		configString
	);

	console.log('Created a .wp-env.override.json file.', configString);
};

maybeCreateOverrideConfig();
