module.exports = {
	...require( '@wordpress/scripts/config/jest-unit.config' ),
	testMatch: [
		// Run theme type specific tests
		`**/unit/**/*.${ process.env.WP_THEME_TYPE }.test.[jt]s`,

		// Run the default tests
		'**/unit/**/[^.]+.test.[jt]s',

		// Don't run sanity tests
		'!**/unit/**/sanity/**',
	],
};
