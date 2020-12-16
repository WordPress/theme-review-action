const Utils = require('./utils');

/**
 * Outputs the type of theme to github based on file structure
 */
const setThemeType = () => {
	if (Utils.getParentTheme()) {
		console.log('::set-output name=theme-type::child');
	} else if (Utils.isBlockBasedTheme()) {
		console.log('::set-output name=theme-type::block');
	} else {
		console.log('::set-output name=theme-type::default');
	}
};

/**
 * Outputs the location for the screenshots in the ui-check
 */
const setUIScreenshotPath = () => {
	console.log(
		`::set-output name=location::${process.env.GITHUB_ACTION_PATH}/actions/ui-check/screenshots`
	);
};

/**
 * Outputs the location for the logs
 */
const setLogPath = () => {
	console.log(
		`::set-output name=logs::${process.env.GITHUB_ACTION_PATH}/logs`
	);
};

//INIT
setThemeType();
setUIScreenshotPath();
setLogPath();
