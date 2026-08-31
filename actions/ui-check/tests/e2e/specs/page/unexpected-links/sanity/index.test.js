/**
 * External dependencies
 */
import path from 'path';

/**
 * Internal dependencies
 */
import { test, expect } from '../../../../fixtures';
import checkFn from '../index.js';

test.describe( 'Sanity: Unexpected Links', () => {
	test( 'Page should PASS when all links are approved', async ( {
		page,
	} ) => {
		await page.goto( `file:${ path.join( __dirname, 'html/pass.html' ) }` );

		expect( await checkFn( page, '/' ) ).toBeTruthy();
	} );

	test( 'Page should FAIL when links include unapproved hostnames', async ( {
		page,
	} ) => {
		await page.goto( `file:${ path.join( __dirname, 'html/fail.html' ) }` );

		expect( await checkFn( page, '/' ) ).toBeFalsy();
	} );
} );
