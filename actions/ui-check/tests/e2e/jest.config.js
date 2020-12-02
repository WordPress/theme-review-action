module.exports = {
	...require( '@wordpress/scripts/config/jest-e2e.config' ),
	testTimeout: 1000000,
	verbose: true,
	haste: {
		providesModuleNodeModules: [ '.*' ],
	},
	testPathIgnorePatterns: [ '<rootDir>/node_modules/' ],
	transformIgnorePatterns: [ '<rootDir>/node_modules/' ],
	modulePathIgnorePatterns: [ '<rootDir>/node_modules/' ],
	setupFilesAfterEnv: [
		'<rootDir>/jest.defaults.js',
		'@wordpress/jest-console',
		'@wordpress/jest-puppeteer-axe',
		'expect-puppeteer',
    ],
    testMatch: [
        // Run theme type specific tests
        `**/e2e/**/*.${ process.env.THEME_TYPE }.test.[jt]s`,

        // Run the default tests
        '**/e2e/**/[^.]+.test.[jt]s'
	],
};
