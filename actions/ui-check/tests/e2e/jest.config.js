let configs = {
	...require( '@wordpress/scripts/config/jest-e2e.config' ),
	testTimeout: 1000000,
	verbose: true,

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
		'**/e2e/**/[^.]+.test.[jt]s',
	],
};

// When run using NPX there are issues related to running in a `node_modules` folder.
if ( process.env.WP_USING_NPX ) {
	configs = {
		...configs,
		...{
			haste: {
				providesModuleNodeModules: [ '.*' ],
			},
			transformIgnorePatterns: [ '<rootDir>/node_modules/' ],
			testPathIgnorePatterns: [ '<rootDir>/node_modules/' ],
			modulePathIgnorePatterns: [ '<rootDir>/node_modules/' ],
		},
	};
}

module.exports = configs;
