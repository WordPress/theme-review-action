module.exports = {
	...require( '@wordpress/scripts/config/jest-e2e.config' ),
	testTimeout: 1000000,
	setupFilesAfterEnv: [
		'<rootDir>/jest.defaults.js',
		'@wordpress/jest-console',
		'@wordpress/jest-puppeteer-axe',
		'expect-puppeteer',
	],
};
