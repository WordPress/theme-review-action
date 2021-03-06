/**
 * External dependencies
 */
const fs = require( 'fs' );
const path = require( 'path' );

/**
 * Internal dependencies
 */
import testTemplates from '../index.js';

const loadFileContents = ( localPath ) => {
	return fs.readFileSync( path.resolve( __dirname, localPath ), {
		encoding: 'utf8',
	} );
};

describe( 'Sanity: Block Templates', () => {
	it( 'Page should PASS when the template is parsed properly', async () => {
		const contents = loadFileContents( 'html/pass.html' );
		expect(
			testTemplates( [
				{
					fileName: 'pass.html',
					contents: contents,
				},
			] )
		).toBeTruthy();
	} );

	it( 'Page should FAIL when there are unclosed tags', async () => {
		const contents = loadFileContents(
			'html/fail-malformed-unclosed.html'
		);
		expect(
			testTemplates( [
				{
					fileName: 'fail-malformed-unclosed.html',
					contents: contents,
				},
			] )
		).toBeFalsy();
	} );

	it( 'Page should FAIL when there are missing closing tags', async () => {
		const contents = loadFileContents(
			'html/fail-missing-closing-tag.html'
		);
		expect(
			testTemplates( [
				{
					fileName: 'fail-missing-closing-tag.html',
					contents: contents,
				},
			] )
		).toBeFalsy();
	} );
} );
