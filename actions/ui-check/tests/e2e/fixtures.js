const { test: base, expect, chromium } = require('@playwright/test');
const { createURL } = require('../utils/environment');
const { htmlFileName, writeOutputHtml } = require('../utils/puppeteer');

/**
 * Test fixtures for the ui-check e2e suite.
 *
 * Replaces the ambient `page`/`browser` the old puppeteer environment injected.
 * The worker browser connects to the isolated container server when
 * PLAYWRIGHT_WS_ENDPOINT is set, and otherwise launches locally, honouring the
 * project's headless option (so --headed works for local dev).
 */
const test = base.extend({
	browser: [
		async ({ headless }, use) => {
			const endpoint = process.env.PLAYWRIGHT_WS_ENDPOINT;
			const browser = endpoint
				? await chromium.connect(endpoint)
				: await chromium.launch({ headless });

			await use(browser);
			await browser.close();
		},
		{ scope: 'worker' },
	],

	pageErrors: async ({ page }, use) => {
		const errors = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await use(errors);
	},

	goTo: async ({ page }, use) => {
		await use(async (url, query = '') => {
			// 'load', not 'networkidle', which persistent theme connections can stall indefinitely.
			const response = await page.goto(createURL(url, query), {
				waitUntil: 'load',
			});

			try {
				writeOutputHtml(
					htmlFileName(url, query),
					await response.text()
				);
			} catch (ex) {
				console.log(ex);
			}

			return response;
		});
	},
});

module.exports = { test, expect };
