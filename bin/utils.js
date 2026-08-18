const fs = require('fs');
const path = require('path');

const THEME_PATH_ROOT = path.join(__dirname, '../test-theme');
const READ_OPTIONS = { encoding: 'utf8' };

const getParentTheme = () => {
	try {
		const styleLocation = `${THEME_PATH_ROOT}/style.css`;
		const templateRegex = /Template:(\s*[^\s]+)/gim; // Template: ${parentTheme}

		// Load in style.css to check for parent
		const themeStyle = fs.readFileSync(styleLocation, READ_OPTIONS);
		const template = themeStyle.match(templateRegex);
		return template[0].toLowerCase().replace(/template:(\s*)/ig, '').trim();
	} catch (ex) {}

	return false;
};

const isBlockBasedTheme = () => {
	return (
		fs.existsSync( `${THEME_PATH_ROOT}/templates/index.html` ) ||
		fs.existsSync( `${THEME_PATH_ROOT}/block-templates/index.html` )
	);
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
 * Theme Check runs inside the wp-env container and writes its results from
 * there, so its logs get a subdirectory that can be mounted on its own. The
 * other checks run on the host and stay at the top level, out of reach of
 * anything running in the container.
 *
 * @type {string}
 */
const CONTAINER_WRITTEN_CHECK = 'theme-check';

/**
 * Returns the log file locations for one of the checks in /actions.
 *
 * @param {string} logPath    Path to the logs directory.
 * @param {string} folderName Name of the check's folder in /actions.
 * @returns {{dir: string, errors: string, warnings: string}}
 */
const getLogPaths = (logPath, folderName) => {
	if (folderName === CONTAINER_WRITTEN_CHECK) {
		return {
			dir: `${logPath}/${folderName}`,
			errors: `${logPath}/${folderName}/errors.txt`,
			warnings: `${logPath}/${folderName}/warnings.txt`,
		};
	}

	return {
		dir: logPath,
		errors: `${logPath}/${folderName}-errors.txt`,
		warnings: `${logPath}/${folderName}-warnings.txt`,
	};
};

/**
 * Create logs for all folders in /actions
 */
const createLogs = (actionsPath, logPath, verbose) => {
	try {
		const directories = fs
			.readdirSync(actionsPath, { withFileTypes: true })
			.filter((d) => d.isDirectory())
			.map((d) => d.name);

		if (!fs.existsSync(logPath)) {
			fs.mkdirSync(logPath);
		}

		for (let i = 0; i < directories.length; i++) {
			const folderName = directories[i];
			const { dir, errors, warnings } = getLogPaths(logPath, folderName);

			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}

			fs.openSync(errors, 'w');
			fs.openSync(warnings, 'w');
			if (verbose) {
				console.log('Created log:', errors);
				console.log('Created log:', warnings);
			}
		}

		return true;
	} catch (e) {
		console.log(e);
	}
	return false;
};

module.exports = {
	isBlockBasedTheme,
	getParentTheme,
	isWindows,
	fancyTimeFormat,
	getThemeType,
	createLogs,
};
