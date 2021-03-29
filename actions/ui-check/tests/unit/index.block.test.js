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

	fs.readdirSync( location ).forEach( ( file ) => {
		const contents = fs.readFileSync( `${ location }/${ file }`, {
			encoding: 'utf8',
		} );

		arr.push( {
			fileName: file,
			contents: contents,
		} );
	} );

	return arr;
};

/**
 * Collects the template parts from theme
 */
const getTemplates = () => {
	const templateLocation = `${ THEME_ROOT_FOLDER }/block-templates`;
	const templatePartLocation = `${ THEME_ROOT_FOLDER }/block-template-parts`;

	return [
		...getFileContents( templateLocation ),
		...getFileContents( templatePartLocation ),
	];
};

describe( 'Unit: Blocks', () => {
	// Load all the block templates to test their structure
	let templates = getTemplates();

	it( 'Should have properly formed gutenberg block comments in templates', async () => {
		testTemplates( templates );
	} );
} );
