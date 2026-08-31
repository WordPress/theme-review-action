/**
 * External dependencies
 */
import path from 'path';

/**
 * Internal dependencies
 */
import { test, expect } from '../../../../fixtures';
import checkFn from '../index.js';

test.describe( 'Sanity: JS Error', () => {
	test( 'Page should PASS when there are no js errors', async ( {
		page,
		pageErrors,
	} ) => {
		await page.goto( `file:${ path.join( __dirname, 'html/pass.html' ) }` );

		expect( await checkFn( '/', pageErrors ) ).toBeTruthy();
	} );

	test( 'Page should FAIL when there is a js error', async ( {
		page,
		pageErrors,
	} ) => {
		await page.goto( `file:${ path.join( __dirname, 'html/fail.html' ) }` );
		// Give the pageerror event time to fire before checking.
		await page.waitForTimeout( 200 );

		expect( await checkFn( '/', pageErrors ) ).toBeFalsy();
	} );
} );
