/**
 * External dependencies
 */
import path from 'path';

/**
 * Internal dependencies
 */
import { test, expect } from '../../../../fixtures';
import checkFn from '../index.js';

test.describe( 'Sanity: Body Class Test', () => {
	test( 'Page should PASS when there is a body class', async ( { page } ) => {
		await page.goto( `file:${ path.join( __dirname, 'html/pass.html' ) }` );

		expect( await checkFn( page, '', 'body-class' ) ).toBeTruthy();
	} );

	test( 'Page should FAIL when there is no body class', async ( {
		page,
	} ) => {
		await page.goto( `file:${ path.join( __dirname, 'html/fail.html' ) }` );

		expect( await checkFn( page, '', 'body-class' ) ).toBeFalsy();
	} );

	test( 'Page should FAIL when response is empty', async ( { page } ) => {
		await page.goto( `file:${ path.join( __dirname, 'html/empty.html' ) }` );

		expect( await checkFn( page, '', 'body-class' ) ).toBeFalsy();
	} );
} );
