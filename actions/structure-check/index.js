/**
 * External dependencies
 */
const fs = require('fs');
const path = require('path');

const READ_OPTIONS = { encoding: 'utf8' };
const ROOT_PATH = path.join(__dirname, '../../');
const ROOT_PATH_THEME = `${ROOT_PATH}/test-theme`;

const isChildTheme = () => {
	return process.env.WP_THEME_TYPE === 'child';
};

const isBlockBasedTheme = () => {
	return process.env.WP_THEME_TYPE === 'block';
};

/**
 * Adds messaging to log
 * @param {array} lines
 */
const appendToLog = (input) => {
	const path = `${ROOT_PATH}/logs/structure-check-errors.txt`;

	fs.appendFileSync(path, `${input}\n\n`, {
		encoding: 'utf8',
	});
};

(() => {
	console.log('Running structure check.');
	let hasErrors = false;

	// Child Themes don't require an index.php
	let needsIndexPhp = !isChildTheme();

	// Block themes don't need index.php, if the index.html template exists.
	if (
		isBlockBasedTheme() &&
		(
			fs.existsSync(`${ROOT_PATH_THEME}/templates/index.html`) ||
			fs.existsSync(`${ROOT_PATH_THEME}/block-templates/index.html`)
		)
	) {
		needsIndexPhp = false;
	}
	
	if ( needsIndexPhp && !fs.existsSync(`${ROOT_PATH_THEME}/index.php`)) {
		appendToLog('The theme is required to have an index.php file.');
		hasErrors = true;
	}

	// Block themes require theme.json
	if (
		isBlockBasedTheme() &&
		!fs.existsSync(`${ROOT_PATH_THEME}/theme.json`)
	) {
		appendToLog(
			'Block themes are quired to have a theme.json file.'
		);
		hasErrors = true;
	}

	if (!fs.existsSync(`${ROOT_PATH_THEME}/style.css`)) {
		appendToLog('The theme is required to have a style.css file.');
		hasErrors = true;
	}

	if (
		!fs.existsSync(`${ROOT_PATH_THEME}/screenshot.png`) &&
		!fs.existsSync(`${ROOT_PATH_THEME}/screenshot.jpg`) &&
		!fs.existsSync(`${ROOT_PATH_THEME}/screenshot.jpeg`)
	) {
		appendToLog(
			'The theme is required to have a screenshot.png or screenshot.jpg file.'
		);
		hasErrors = true;
	}

	if (hasErrors) {
		throw Error('Failed basic structure.');
	}

	console.log('Complete structure check.');
})();
