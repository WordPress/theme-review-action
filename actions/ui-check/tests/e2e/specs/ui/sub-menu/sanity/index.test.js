/**
 * External dependencies
 */
import path from 'path';

/**
 * Internal dependencies
 */
import { test, expect } from '../../../../fixtures';
import checkFn from '../index.js';

test.describe( 'Sanity: Sub Menu', () => {
	test( 'Page should PASS when there are no menus', async ( { page } ) => {
		await page.goto(
			`file:${ path.join( __dirname, 'html/pass-no-menu.html' ) }`
		);

		expect( await checkFn( page ) ).toBeTruthy();
	} );

	test( 'Page should PASS', async ( { page } ) => {
		await page.goto( `file:${ path.join( __dirname, 'html/pass.html' ) }` );

		expect( await checkFn( page ) ).toBeTruthy();
	} );

	test( 'Page should FAIL when no menu opens', async ( { page } ) => {
		await page.goto(
			`file:${ path.join( __dirname, 'html/fail-no-menus-open.html' ) }`
		);

		expect( await checkFn( page ) ).toBeFalsy();
	} );
} );
