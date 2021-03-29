/**
 * External dependencies
 */
const fs = require( 'fs' );
const path = require( 'path' );

/**
 * Internal dependencies
 */
import TemplateTest from '../index.js';

const loadFileContents = ( localPath ) => {
	return fs.readFileSync( path.resolve( __dirname, localPath ), {
		encoding: 'utf8',
	} );
};

describe( 'Sanity: Block Templates', () => {
	it( 'Page should PASS when the template is parsed properly', async () => {
		const contents = loadFileContents( 'html/pass.html' );
		expect(
			TemplateTest( [
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
			TemplateTest( [
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
			TemplateTest( [
				{
					fileName: 'fail-missing-closing-tag.html',
					contents: contents,
				},
			] )
		).toBeFalsy();
	} );
} );
