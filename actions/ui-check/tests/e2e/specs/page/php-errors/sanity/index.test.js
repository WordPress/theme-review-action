/**
 * External dependencies
 */
import path from 'path';

/**
 * Internal dependencies
 */
import { test, expect } from '../../../../fixtures';
import checkFn from '../index.js';

test.describe( 'Sanity: PHP Errors', () => {
	test( 'Page should PASS when there is no php error present', async ( {
		page,
	} ) => {
		const url = 'html/pass.html';
		const response = await page.goto(
			`file:${ path.join( __dirname, url ) }`
		);
		const content = await response.text();

		expect( await checkFn( url, content ) ).toBeTruthy();
	} );

	test( 'Page should FAIL when there is a php error present', async ( {
		page,
	} ) => {
		const url = 'html/fail.html';
		const response = await page.goto(
			`file:${ path.join( __dirname, url ) }`
		);
		const content = await response.text();

		expect( await checkFn( url, content ) ).toBeFalsy();
	} );

	test( 'Page should FAIL when there is a php error on multiple lines', async ( {
		page,
	} ) => {
		const url = 'html/fail-multiline.html';
		const response = await page.goto(
			`file:${ path.join( __dirname, url ) }`
		);
		const content = await response.text();

		expect( await checkFn( url, content ) ).toBeFalsy();
	} );

	test( 'Page should FAIL when there is a php error in an attribute', async ( {
		page,
	} ) => {
		const url = 'html/fail-attribute.html';
		const response = await page.goto(
			`file:${ path.join( __dirname, url ) }`
		);
		const content = await response.text();

		expect( await checkFn( url, content ) ).toBeFalsy();
	} );
} );
