const fs = require( 'fs' );

/**
 * Runs before all tests
 */

const createScreenshotFolder = ( dir ) => {
	if ( ! fs.existsSync( dir ) ) {
		fs.mkdirSync( dir );
	}
};

beforeAll( async () => {
	createScreenshotFolder( '../../screenshots' );

	// We are currently only applying tests for desktop sizing
	await page.setViewport( { width: 1280, height: 800 } );
} );
