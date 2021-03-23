const fs = require( 'fs' );
const path = require( 'path' );

/**
 * Runs before all tests
 */

const createScreenshotFolder = ( dir ) => {
	if ( ! fs.existsSync( dir ) ) {
		fs.mkdirSync( dir );
	}
};

beforeAll( async () => {
	createScreenshotFolder( path.join(__dirname, '../../screenshots') );
} );
