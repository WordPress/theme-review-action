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

    // We want to test this but this exits the test framework on page error which we don't want.
    // We can set a jest property 'exitOnPageError: false' but then the error is not recorded properly. 
    // We can cycle back later.

	// it( 'Page should FAIL when there is js error', async () => {
	// 	await page.goto( `file:${ path.join( __dirname, 'html/fail.html' ) }` );
	// 	try {
	// 		expect( await test( '/' ) ).toBeFalsy();
	// 	} catch ( e ) {
	// 		//console.log( e );
	// 	}
	// } );
} );
