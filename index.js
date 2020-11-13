const fs = require('fs');

const THEME_PATH_ROOT = './test-theme';
const READ_OPTIONS = { encoding: 'utf8' };

const getParentTheme = () => {
	try {
		const styleLocation = `${THEME_PATH_ROOT}/style.css`;
		const templateRegex = /Template:(\s?[^\s]+)/gim; // Template: ${parentTheme}

		// Load in style.css to check for parent
		const themeStyle = fs.readFileSync(styleLocation, READ_OPTIONS);
		const template = themeStyle.match(templateRegex);
		return template[0].toLowerCase().replace('template:', '').trim();
	} catch (ex) {}

	return false;
};

const isBlockBasedTheme = () => {
	try {
		fs.readFileSync(
			`${THEME_PATH_ROOT}/block-templates/index.html`,
			READ_OPTIONS
		);

		return true;
	} catch (e) {}
	return false;
};

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
const createOverrideConfig = () => {
	const parentTheme = getParentTheme();
	const isBlockBased = isBlockBasedTheme();

	if (!parentTheme && !isBlockBased) {
		console.log('No need for an override.');
		return;
	}

	const configs = getWpEnv();

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
	const configString = JSON.stringify(configs);
	fs.writeFileSync('./.wp-env.override.json', configString);

	console.log('Created a .wp-env.override.json file.', configString);
};

createOverrideConfig();

//
