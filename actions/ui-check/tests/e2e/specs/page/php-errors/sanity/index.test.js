/**
 * External dependencies
 */
import path from 'path';

/**
 * Internal dependencies
 */
import test from '../index.js';

describe( 'Sanity: PHP Errors', () => {
	it( 'Page should PASS when there is not php error present', async () => {
		const url = 'html/pass.html';
		const response = await page.goto(
			`file:${ path.join( __dirname, url ) }`
		);

		const content = await response.text();
		expect( await test( url, content ) ).toBeTruthy();
	} );

	it( 'Page should FAIL when there is a php error present', async () => {
		const url = 'html/fail.html';
		const response = await page.goto(
			`file:${ path.join( __dirname, url ) }`
		);

		const content = await response.text();
		expect( await test( url, content ) ).toBeFalsy();
	} );

	it( 'Page should FAIL when there is a php present on multiple lines', async () => {
		const url = 'html/fail-multiline.html';
		const response = await page.goto(
			`file:${ path.join( __dirname, url ) }`
		);

		const content = await response.text();
		expect( await test( url, content ) ).toBeFalsy();
	} );

	it( 'Page should FAIL when there is a php error present in an attribute', async () => {
		const url = 'html/fail-attribute.html';
		const response = await page.goto(
			`file:${ path.join( __dirname, url ) }`
		);
		const content = await response.text();
		expect( await test( url, content ) ).toBeFalsy();
	} );
} );
