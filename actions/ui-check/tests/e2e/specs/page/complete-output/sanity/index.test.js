/**
 * External dependencies
 */
import path from 'path';

/**
 * Internal dependencies
 */
import { test, expect } from '../../../../fixtures';
import checkFn from '../index.js';

test.describe( 'Sanity: Complete Output', () => {
	test( 'Page should PASS when the html is complete', async ( { page } ) => {
		const response = await page.goto(
			`file:${ path.join( __dirname, 'html/pass.html' ) }`
		);
		const text = await response.text();

		expect( await checkFn( '/', text ) ).toBeTruthy();
	} );

	test( 'Page should FAIL when the html is incomplete', async ( {
		page,
	} ) => {
		const response = await page.goto(
			`file:${ path.join( __dirname, 'html/fail.html' ) }`
		);
		const text = await response.text();

		expect( await checkFn( '/', text ) ).toBeFalsy();
	} );
} );
