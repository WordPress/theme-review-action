const fs = require('fs');
const path = require('path');

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
		return process.env.CI || process.env.CI === 'true';
	} catch (e) {}
	return false;
};

// Thanks: https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
const fancyTimeFormat = (duration) => {
	var hrs = ~~(duration / 3600);
	var mins = ~~((duration % 3600) / 60);
	var secs = ~~duration % 60;

	// Output like "1:01" or "4:03:59" or "123:03:59"
	var ret = '';

	if (hrs > 0) {
		ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
	}

	ret += '' + mins + ':' + (secs < 10 ? '0' : '');
	ret += '' + secs;
	return ret;
};

/**
 * Returns true if running on windows.
 */
const isWindows = () => {
	return process.platform === 'win32';
};

const getThemeType = () => {
	if (getParentTheme()) {
		return 'child';
	} else if (isBlockBasedTheme()) {
		return 'block';
	} else {
		return 'default';
	}
};

/**
 * Create logs for all folders in /actions
 */
const createLogs = ( logPath ) => {
	try {
		const directories = fs
			.readdirSync('./actions', { withFileTypes: true })
			.filter((d) => d.isDirectory())
			.map((d) => d.name);

		if (!fs.existsSync(logPath)) {
			fs.mkdirSync(logPath);
		}

		directories.forEach((folderName) => {
			const errorLogPath = `./logs/${folderName}-errors.txt`;
			const warningLogPath = `./logs/${folderName}-warnings.txt`;

			fs.openSync(errorLogPath, 'w');
			fs.openSync(warningLogPath, 'w');
		});

		return true;
	} catch (e) {
		console.log(e);
	}
	return false;
};

module.exports = {
	isBlockBasedTheme,
	getParentTheme,
	isCI,
	isWindows,
	fancyTimeFormat,
	getThemeType,
	createLogs
};
