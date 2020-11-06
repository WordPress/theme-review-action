const fs = require('fs');

/**
 * Creates an override config file sometimes
 */
const createOverrideConfig = () => {
	const styleLocation = './test-theme/style.css';
	const wpenvLocation = './.wp-env.json';
	const wpenvOverrideLocation = './.wp-env.override.json';
	const templateRegex = /Template:(\s?[^\s]+)/gim; // Template: ${parentTheme}
	const readOptions = { encoding: 'utf8' };

	// Pull in style.css to check for parent
	const themeStyle = fs.readFileSync(styleLocation, readOptions);

	// Look for "Template: ..." in the style config.
	const template = themeStyle.match(templateRegex);

	// If its a child add the parent theme to the .wp-env.json and create override
	if (template !== null) {
		const jsonContent = fs.readFileSync(wpenvLocation, readOptions);
		const parentTheme = template[0]
			.toLowerCase()
			.replace('template:', '')
			.trim();
		const configs = JSON.parse(jsonContent);

		configs.themes.push(
			`https://downloads.wordpress.org/theme/${parentTheme}.zip`
		);
		fs.writeFileSync(wpenvOverrideLocation, JSON.stringify(configs));

		console.log('Created a .wp-env.override.json file.');
	} else {
		console.log('No need for an override.');
	}
};

createOverrideConfig();
