import path from 'path';

/**
 * Internal dependencies
 */
import test from '../index.js';

describe( 'Sanity: Body Class Test', () => {
	it( 'Page should PASS when there is a body class', async () => {
		await page.goto( `file:${ path.join( __dirname, 'html/pass.html' ) }` );

		expect( await test( '', 'body-class' ) ).toBeTruthy();
	} );

	it( 'Page should FAIL when there is no body class', async () => {
		await page.goto( `file:${ path.join( __dirname, 'html/fail.html' ) }` );

		expect( await test( '', 'body-class' ) ).toBeFalsy();
	} );

	it( 'Page should FAIL when response is empty', async () => {
		await page.goto(
			`file:${ path.join( __dirname, 'html/empty.html' ) }`
		);

		expect( await test( '', 'body-class' ) ).toBeFalsy();
	} );
} );
