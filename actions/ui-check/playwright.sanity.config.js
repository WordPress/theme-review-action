const { defineConfig } = require('@playwright/test');
const base = require('./playwright.config.js');

/*
 * Runs only the fixture-driven sanity specs, which the default config ignores.
 */
module.exports = defineConfig({
	...base,
	testMatch: [/\/sanity\/.*\.test\.js$/],
	testIgnore: [],
});
