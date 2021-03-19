/**
 * External dependencies
 */
import path from 'path';

/**
 * Internal dependencies
 */
import test from '../index.js';

describe( 'Sanity: Tabbing', () => {
	it( 'Page should PASS when tabbing is sequential', async () => {
		await page.goto( `file:${ path.join( __dirname, 'html/pass.html' ) }` );

		expect( await test() ).toBeTruthy();
	} );

	it( 'Page should FAIL when tabbing is not sequential', async () => {
		await page.goto( `file:${ path.join( __dirname, 'html/fail.html' ) }` );

		expect( await test() ).toBeFalsy();
	} );
} );
