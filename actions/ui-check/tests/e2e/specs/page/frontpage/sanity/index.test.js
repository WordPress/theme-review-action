/**
 * External dependencies
 */
import path from 'path';

/**
 * Internal dependencies
 */
import { test, expect } from '../../../../fixtures';
import checkFn from '../index.js';

test.describe( 'Sanity: Blog Body Class Test', () => {
	test( 'Page should PASS when the body class includes blog', async ( {
		page,
	} ) => {
		await page.goto( `file:${ path.join( __dirname, 'html/pass.html' ) }` );

		expect( await checkFn( page, '' ) ).toBeTruthy();
	} );

	test( 'Page should FAIL when the body class does not include blog', async ( {
		page,
	} ) => {
		await page.goto( `file:${ path.join( __dirname, 'html/fail.html' ) }` );

		expect( await checkFn( page, '' ) ).toBeFalsy();
	} );

	test( 'Page should FAIL when response is empty', async ( { page } ) => {
		await page.goto( `file:${ path.join( __dirname, 'html/empty.html' ) }` );

		expect( await checkFn( page, '' ) ).toBeFalsy();
	} );
} );
