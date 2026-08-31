const fs = require( 'fs' );
const path = require( 'path' );

import { OUTPUT_HTML_FOLDER_PATH } from './paths';

const cleanQueryStringForFileSystem = ( queryString ) => {
	return queryString.replace( '?', '-' );
};

/**
 * Builds the output file name for a visited URL.
 *
 * @param {string} url         Visited path.
 * @param {string} queryString Query string, if any.
 * @return {string} File name (without extension) for the output directory.
 */
export const htmlFileName = ( url, queryString = '' ) => {
	return (
		url.replaceAll( '/', 'home' ) +
		cleanQueryStringForFileSystem( queryString )
	);
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
export const writeOutputHtml = ( fileName, content ) => {
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
