const Utils = require('./utils');

const IS_CI = Utils.isCI();

const setConfiguration = (key, value) => {
	if (IS_CI) {
		console.log(`::set-output name=${key}::${value}`);
	} else {
		process.env[key] = value;
	}
};

/**
 * Outputs the type of theme to github based on file structure
 */
const setThemeType = () => {
	if (Utils.getParentTheme()) {
		setConfiguration('THEME_TYPE', 'child');
	} else if (Utils.isBlockBasedTheme()) {
		setConfiguration('THEME_TYPE', 'block');
	} else {
		setConfiguration('THEME_TYPE', 'default');
	}
};

/**
 * Outputs the location for the screenshots in the ui-check
 */
const setUIScreenshotPath = () => {
	setConfiguration(
		'location',
		`${process.env.GITHUB_ACTION_PATH}/actions/ui-check/screenshots`
	);
};

/**
 * Outputs the location for the logs
 */
const setLogPath = () => {
	setConfiguration('name', `${process.env.GITHUB_ACTION_PATH}/logs`);
};

(() => {
	if (IS_CI) {
		setUIScreenshotPath();
		setLogPath();
	}

    setThemeType();
})();

