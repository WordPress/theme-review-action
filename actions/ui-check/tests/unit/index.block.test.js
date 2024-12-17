/**
 * External dependencies
 */
const fs = require( 'fs' );

/**
 * Internal dependencies
 */
import testTemplates from './block-templates/index';

// Relative path
const THEME_ROOT_FOLDER = '../../test-theme';

/**
 * Reads local filesystem and returns the templates
 * @param {location} location Path to test theme folder
 * @returns {array}
 */
const getFileContents = ( location ) => {
	const arr = [];

	if ( ! fs.existsSync( location ) ) {
		return arr;
	}

	fs.readdirSync( location ).forEach( ( file ) => {
		const contents = fs.readFileSync( `${ location }/${ file }`, {
			encoding: 'utf8',
		} );

		arr.push( {
			fileName: `${ location }/${ file }`.replace(
				THEME_ROOT_FOLDER,
				''
			),
			contents: contents,
		} );
	} );

	return arr;
};

/**
 * Collects the template parts from theme
 */
const getTemplates = () => {
	return [
		...getFileContents( `${ THEME_ROOT_FOLDER }/block-templates` ),
		...getFileContents( `${ THEME_ROOT_FOLDER }/block-template-parts` ),
		...getFileContents( `${ THEME_ROOT_FOLDER }/templates` ),
		...getFileContents( `${ THEME_ROOT_FOLDER }/template-parts` ),
	];
};

describe( 'Unit: Blocks', () => {
	// Load all the block templates to test their structure
	let templates = getTemplates();

	it( 'Should have properly formed gutenberg block comments in templates', async () => {
		testTemplates( templates );
	} );
} );
