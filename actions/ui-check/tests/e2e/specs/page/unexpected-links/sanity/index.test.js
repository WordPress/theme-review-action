/**
 * External dependencies
 */
import path from 'path';

/**
 * Internal dependencies
 */
import test from '../index.js';

describe( 'Sanity: Unexpected Links', () => {
	it( 'Page should PASS when all links are approved.', async () => {
		await page.goto( `file:${ path.join( __dirname, 'html/pass.html' ) }` );

		expect( await test( '/', '' ) ).toBeTruthy();
	} );

	it( 'Page should FAIL when links include unapproved hostnames.', async () => {
		await page.goto( `file:${ path.join( __dirname, 'html/fail.html' ) }` );

		expect( await test( '/', '' ) ).toBeFalsy();
	} );
} );
