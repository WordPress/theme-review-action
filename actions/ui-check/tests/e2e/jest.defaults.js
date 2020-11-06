/**
 * Runs before all tests
 */

beforeAll( async () => {
	// We are currently only applying tests for desktop sizing
	await page.setViewport( { width: 1280, height: 800 } );
} );
