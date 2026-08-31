/**
 * External dependencies
 */
import path from 'path';

/**
 * Internal dependencies
 */
import { test, expect } from '../../../../fixtures';
import checkFn from '../index.js';

test.describe( 'Sanity: Skip Links', () => {
	test( 'Page should PASS when there is a skip link', async ( { page } ) => {
		await page.goto( `file:${ path.join( __dirname, 'html/pass.html' ) }` );

		expect( await checkFn( page ) ).toBeTruthy();
	} );

	test( 'Page should FAIL when there is no skip link', async ( { page } ) => {
		await page.goto( `file:${ path.join( __dirname, 'html/fail.html' ) }` );

		expect( await checkFn( page ) ).toBeFalsy();
	} );

	test( 'Page should FAIL when there is no anchor matching skip link', async ( {
		page,
	} ) => {
		await page.goto(
			`file:${ path.join(
				__dirname,
				'html/fail-no-content-to-match-anchor.html'
			) }`
		);

		expect( await checkFn( page ) ).toBeFalsy();
	} );

	test( 'Page should FAIL when the skip link is not an a tag', async ( {
		page,
	} ) => {
		await page.goto(
			`file:${ path.join( __dirname, 'html/fail-not-a-tag.html' ) }`
		);

		expect( await checkFn( page ) ).toBeFalsy();
	} );

	test( 'Page should FAIL when the skip link does not have an #', async ( {
		page,
	} ) => {
		await page.goto(
			`file:${ path.join( __dirname, 'html/fail-no-hash.html' ) }`
		);

		expect( await checkFn( page ) ).toBeFalsy();
	} );
} );
