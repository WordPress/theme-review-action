/**
 * External dependencies
 */
import path from 'path';

/**
 * Internal dependencies
 */
import test from '../index.js';

describe( 'Sanity: Element Focus', () => {
	it( 'Page should PASS when links have a focus state that passes threshold', async () => {
		await page.goto( `file:${ path.join( __dirname, 'html/pass.html' ) }` );

		expect( await test() ).toBeTruthy();
	} );
	it( 'Page should FAIL when links have no :focus state', async () => {
		await page.goto( `file:${ path.join( __dirname, 'html/fail.html' ) }` );

		expect( await test() ).toBeFalsy();
	} );
} );
