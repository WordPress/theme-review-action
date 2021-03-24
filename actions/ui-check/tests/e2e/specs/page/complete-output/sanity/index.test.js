import path from 'path';

/**
 * Internal dependencies
 */
import test from '../index.js';

describe( 'Sanity: Complete Output', () => {
	it( 'Page should PASS when there is a body class', async () => {
		const response = await page.goto(
			`file:${ path.join( __dirname, 'html/pass.html' ) }`
		);
		const text = await response.text();

		expect( await test( '/', text ) ).toBeTruthy();
	} );

	it( 'Page should FAIL when the html is incomplete', async () => {
		const response = await page.goto(
			`file:${ path.join( __dirname, 'html/fail.html' ) }`
		);
		const text = await response.text();

		expect( await test( '/', text ) ).toBeFalsy();
	} );
} );
