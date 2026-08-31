/**
 * External dependencies
 */
import path from 'path';

/**
 * Internal dependencies
 */
import { test, expect } from '../../../../fixtures';
import checkFn from '../index.js';

test.describe( 'Sanity: Element Focus', () => {
	test( 'Page should PASS when links have a focus state that passes threshold', async ( {
		page,
	} ) => {
		await page.goto( `file:${ path.join( __dirname, 'html/pass.html' ) }` );

		expect( await checkFn( page ) ).toBeTruthy();
	} );

	test( 'Page should FAIL when links have no :focus state', async ( {
		page,
	} ) => {
		await page.goto( `file:${ path.join( __dirname, 'html/fail.html' ) }` );

		expect( await checkFn( page ) ).toBeFalsy();
	} );
} );
