/**
 * External dependencies
 */
import path from 'path';

/**
 * Internal dependencies
 */
import test from '../index.js';

describe( 'Sanity: PHP Errors', () => {
	it( 'Page should PASS when there is not php error present', async () => {
		await page.goto( `file:${ path.join( __dirname, 'html/pass.html' ) }` );

		expect( await test() ).toBeTruthy();
	} );

	it( 'Page should FAIL when there is a php error present', async () => {
		await page.goto( `file:${ path.join( __dirname, 'html/fail.html' ) }` );

		expect( await test() ).toBeFalsy();
	} );

	it( 'Page should FAIL when there is a php present on multiple lines', async () => {
		await page.goto(
			`file:${ path.join( __dirname, 'html/fail-multiline.html' ) }`
		);

		expect( await test() ).toBeFalsy();
	} );
} );
