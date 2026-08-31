const fs = require( 'fs' );
const path = require( 'path' );

import { createURL } from './environment';
import { OUTPUT_HTML_FOLDER_PATH } from './paths';

const cleanQueryStringForFileSystem = ( queryString ) => {
	return queryString.replace( '?', '-' );
};

/**
 * Writes a page's contents to a file inside the output directory.
 *
 * The file name comes from untrusted theme data, so confine the write to the
 * output directory and never follow a symlink at the destination.
 *
 * @param {string} fileName File name derived from the visited URL.
 * @param {string} content  Page contents to write.
 */
const writeOutputHtml = ( fileName, content ) => {
	const outputDir = path.resolve( OUTPUT_HTML_FOLDER_PATH );
	const destination = path.resolve( outputDir, `${ fileName }.html` );

	if ( ! destination.startsWith( outputDir + path.sep ) ) {
		throw new Error(
			`Refusing to write outside the output directory: ${ destination }`
		);
	}

	// O_NOFOLLOW fails instead of writing through a symlinked destination.
	const fd = fs.openSync(
		destination,
		fs.constants.O_WRONLY |
			fs.constants.O_CREAT |
			fs.constants.O_TRUNC |
			fs.constants.O_NOFOLLOW
	);

	try {
		fs.writeFileSync( fd, content );
	} finally {
		fs.closeSync( fd );
	}
};

export const goTo = async ( url, queryString = '' ) => {
	let response = await page.goto( createURL( url, queryString ), {
		waitUntil: 'networkidle2',
	} );
	let content = await response.text();

	try {
		const fileName =
			url.replaceAll( '/', 'home' ) +
			cleanQueryStringForFileSystem( queryString );

		writeOutputHtml( fileName, content );
	} catch ( ex ) {
		console.log( ex );
	}

	return response;
};
