/**
 * External dependencies
 */
import path from 'path';

/**
 * Internal dependencies
 */
import test from '../index.js';

describe( 'Sanity: Skip Links', () => {
	it( 'Page should PASS when there is a skip link', async () => {
		await page.goto( `file:${ path.join( __dirname, 'html/pass.html' ) }` );

		expect( await test() ).toBeTruthy();
	} );

	it( 'Page should FAIL when there is no skip link', async () => {
		await page.goto( `file:${ path.join( __dirname, 'html/fail.html' ) }` );

		expect( await test() ).toBeFalsy();
	} );

	it( 'Page should FAIL when there is no anchor matching skip link', async () => {
		await page.goto(
			`file:${ path.join(
				__dirname,
				'html/fail-no-content-to-match-anchor.html'
			) }`
		);

		expect( await test() ).toBeFalsy();
	} );

	it( 'Page should FAIL when the skip link is not an a tag', async () => {
		await page.goto(
			`file:${ path.join( __dirname, 'html/fail-not-a-tag.html' ) }`
		);

		expect( await test() ).toBeFalsy();
	} );

	it( 'Page should FAIL when the skip link does not have an #', async () => {
		await page.goto(
			`file:${ path.join( __dirname, 'html/fail-no-hash.html' ) }`
		);

		expect( await test() ).toBeFalsy();
	} );
} );
