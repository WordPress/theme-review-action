/**
 * External dependencies
 */
import path from 'path';

/**
 * Internal dependencies
 */
import test from '../index.js';

describe( 'Sanity: Sub Menu', () => {
	it( 'Page should PASS when there are no menus', async () => {
		await page.goto(
			`file:${ path.join( __dirname, 'html/pass-no-menu.html' ) }`
		);

		expect( await test() ).toBeTruthy();
	} );

	// it( 'Page should PASS', async () => {
	// 	await page.goto( `file:${ path.join( __dirname, 'html/pass.html' ) }` );

	// 	expect( await test() ).toBeTruthy();
	// } );

	it( 'Page should FAIL when no menu opens', async () => {
		await page.goto(
			`file:${ path.join( __dirname, 'html/fail-no-menus-open.html' ) }`
		);

		expect( await test() ).toBeFalsy();
	} );
} );
