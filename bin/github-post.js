const setConfiguration = (key, value) => {
	console.log(`::set-output name=${key}::${value}`);
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
	console.log('Setting configurations');
	setUIScreenshotPath();
	setLogPath();
})();
