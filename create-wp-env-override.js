const fs = require('fs');
const Utils = require('./utils');

const READ_OPTIONS = { encoding: 'utf8' };

const getWpEnv = () => {
	try {
		const jsonContent = fs.readFileSync('./.wp-env.json', READ_OPTIONS);
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
	const isBlockBased = Utils.isBlockBasedTheme();
	const isCIRun = Utils.isCI();

	if (!parentTheme && !isBlockBased && !isCIRun) {
		console.log('No need for an override.');
		return;
	}

	const configs = getWpEnv();

	if (!configs) {
		return;
	}

	if (parentTheme) {
		configs.themes.push(
			`https://downloads.wordpress.org/theme/${parentTheme}.zip`
		);
	}

	if (isBlockBased) {
		configs.plugins.push(
			`https://downloads.wordpress.org/plugin/gutenberg.zip`
		);
	}

	if (isCIRun) {
		configs.config.CI = true;
	}

	const configString = JSON.stringify(configs);
	fs.writeFileSync('./.wp-env.override.json', configString);

	console.log('Created a .wp-env.override.json file.', configString);
};

maybeCreateOverrideConfig();
