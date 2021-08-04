import path from 'path';

/**
 * Internal dependencies
 */
import test from '../index.js';

describe( 'Sanity: Blog Body Class Test', () => {
	it( 'Page should PASS when the body class includes blog', async () => {
		await page.goto( `file:${ path.join( __dirname, 'html/pass.html' ) }` );

		expect( await test( '', 'frontpage' ) ).toBeTruthy();
	} );

	it( 'Page should FAIL when the body class does not include blog', async () => {
		await page.goto( `file:${ path.join( __dirname, 'html/fail.html' ) }` );

		expect( await test( '', 'frontpage' ) ).toBeFalsy();
	} );

	it( 'Page should FAIL when response is empty', async () => {
		await page.goto(
			`file:${ path.join( __dirname, 'html/empty.html' ) }`
		);

		expect( await test( '', 'frontpage' ) ).toBeFalsy();
	} );
} );
