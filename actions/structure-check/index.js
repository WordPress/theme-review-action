/**
 * External dependencies
 */
const fs = require('fs');
const core = require('@actions/core');

const READ_OPTIONS = { encoding: 'utf8' };
const ROOT_PATH = '../../test-theme';

const isChildTheme = () => {
	process.env.THEME_TYPE === 'child';
};

const isBlockBasedTheme = () => {
	process.env.THEME_TYPE === 'block';
};

/**
 * Return false if the file doesn't exist or can't be read
 * @param {string} filePath
 */
const fileExists = (filePath) => {
	try {
		fs.readFileSync(filePath, READ_OPTIONS);
		return true;
	} catch (e) {
		if (e.code.toLowerCase() !== 'enoent') {
			console.log(e);
		}
	}

	return false;
};

(() => {
	core.info('Running structure check.');

	// Child Themes don't require an index.php
	if (!isChildTheme() && !fileExists(`${ROOT_PATH}/index.php`)) {
		core.error('We require you have an index.php file.');
	}

	// Block based themes require function.php
	if (isBlockBasedTheme() && !fileExists(`${ROOT_PATH}/functions.php'`)) {
		core.error(
			'We require you have an function.php file for a Block Based theme.'
		);
	}

	if (!fileExists(`${ROOT_PATH}/style.css`)) {
		core.error('We require you have a style.css file.');
	}

	if (
		!fileExists(`${ROOT_PATH}/screenshot.png`) &&
		!fileExists(`${ROOT_PATH}/screenshot.jpg`) &&
		!fileExists(`${ROOT_PATH}/screenshot.jpeg`)
	) {
		core.error(
			'We require you have a screenshot.png or screenshot.jpg file.'
		);
	}

	core.info('Complete structure check.');
})();
