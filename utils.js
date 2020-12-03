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


const isCI = () => {
	try {
		return process.env.CI || process.envCI === 'true';
	} catch (e) {}
	return false;
};

module.exports = {
    isBlockBasedTheme,
    getParentTheme,
    isCI
}
