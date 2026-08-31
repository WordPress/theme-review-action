/**
 * External dependencies
 */
import path from 'path';

/**
 * Internal dependencies
 */
import { test, expect } from '../../../../fixtures';
import checkFn from '../index.js';

test.describe( 'Sanity: Tabbing', () => {
	test( 'Page should PASS when tabbing is sequential', async ( { page } ) => {
		await page.goto( `file:${ path.join( __dirname, 'html/pass.html' ) }` );

		expect( await checkFn( page ) ).toBeTruthy();
	} );

	test( 'Page should FAIL when tabbing is not sequential', async ( {
		page,
	} ) => {
		await page.goto( `file:${ path.join( __dirname, 'html/fail.html' ) }` );

		expect( await checkFn( page ) ).toBeFalsy();
	} );
} );
