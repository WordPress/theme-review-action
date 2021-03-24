const fs = require( 'fs' );
const path = require( 'path' );

/**
 * Internal dependencies
 */
import {
	OUTPUT_FOLDER_PATH,
	OUTPUT_HTML_FOLDER_PATH,
	SCREENSHOT_FOLDER_PATH,
} from '../utils';

/**
 * Runs before all tests
 */

const createFolder = ( dir ) => {
	if ( ! fs.existsSync( dir ) ) {
		fs.mkdirSync( dir );
	}
};

beforeAll( async () => {
	const outputPath = path.join( __dirname, `../../${ OUTPUT_FOLDER_PATH }` );
	createFolder( outputPath );
	createFolder( path.join( __dirname, `../../${ SCREENSHOT_FOLDER_PATH }` ) );
	createFolder(
		path.join( __dirname, `../../${ OUTPUT_HTML_FOLDER_PATH }` )
	);
} );
