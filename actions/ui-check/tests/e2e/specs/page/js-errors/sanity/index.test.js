import path from 'path';

/**
 * Internal dependencies
 */
import test from '../index.js';

describe( 'Sanity: JS Error', () => {
	it( 'Page should PASS when there are no js errors', async () => {
		await page.goto( `file:${ path.join( __dirname, 'html/pass.html' ) }` );

		expect( await test( '/' ) ).toBeTruthy();
	} );

	it( 'Page should FAIL when there is js error (Should trigger a local failure)', async () => {
		await page.goto( `file:${ path.join( __dirname, 'html/fail.html' ) }` );
		try {
			expect( await test( '/' ) ).toBeFalsy();
		} catch ( e ) {
			//console.log( e );
		}
	} );
} );
