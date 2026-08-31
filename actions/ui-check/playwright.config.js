const { defineConfig } = require('@playwright/test');

/*
 * The whole run is bounded by bin/program.js's execa timeout; this per-test
 * value only needs to be generous enough for a slow theme page to settle.
 */
const timeout = Number(process.env.UI_CHECK_TIMEOUT) || 300000;

/*
 * Preserve the theme-type naming convention: a *.${WP_THEME_TYPE}.test.js spec
 * runs only for that theme type, alongside the default (no interior dot) specs.
 */
const defaultSpecs = /\/[^./]+\.test\.js$/;
const testMatch = process.env.WP_THEME_TYPE
	? [
			new RegExp( `\\.${ process.env.WP_THEME_TYPE }\\.test\\.js$` ),
			defaultSpecs,
	  ]
	: [ defaultSpecs ];

module.exports = defineConfig({
	testDir: './tests/e2e/specs',
	testMatch,
	testIgnore: ['**/sanity/**'],
	globalSetup: require.resolve('./tests/e2e/global-setup.js'),
	timeout,
	fullyParallel: false,
	reporter: [['list']],
	use: {
		viewport: { width: 1280, height: 800 },
	},
});
