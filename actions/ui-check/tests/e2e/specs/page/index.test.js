/**
 * External dependencies
 */
const fetch = require( 'node-fetch' );

/**
 * Internal dependencies
 */
import { createURL, getTestUrls } from '../../../utils';


import bodyClassTest from './body-class';
import phpErrorsTest from './php-errors';
import completeOutputTest from './complete-output';
import pageStatusTest from './page-status';
import jsErrorTest from './js-errors';
import unexpectedLinksTest from './unexpected-links';

// Some URLs like feeds aren't included in the site map.
// TODO: should we test those separately? Not all of these tests are appropriate.
let urls = [ [ '/', '?feed=rss2', '' ], ...getTestUrls() ];

// Some basic tests that apply to every page
describe.each( urls )( 'Test URL %s%s', ( url, queryString, bodyClass ) => {
	it( 'Page should contain body class ' + bodyClass, async () => {
		// Make sure the page content appears to be appropriate for the URL.
		const fullUrl = createURL( url, queryString );
		await page.goto( fullUrl );

		await bodyClassTest( fullUrl, bodyClass );
	} );

	it( 'Page should not have PHP errors', async () => {
		await page.goto( createURL( url, queryString ) );

		await phpErrorsTest();
	} );

	it( 'Page should have complete output', async () => {
		// This should catch anything that kills output before the end of the page, or outputs trailing garbage.
		const fullUrl = createURL( url, queryString );
		const response = await page.goto( fullUrl );
		const text = await response.text();

		await completeOutputTest( fullUrl, text );
	} );

	it( 'Page should return 200 status', async () => {
		const fullUrl = createURL( url, queryString );
		let response = await page.goto( fullUrl );
		const status = await response.status();

		await pageStatusTest( fullUrl, status );
	} );

	it( 'Browser console should not contain errors', async () => {
		const fullUrl = createURL( '/' );

		await page.goto( fullUrl );
		await jsErrorTest( fullUrl );
	} );

	it( 'Page should not have unexpected links', async () => {
		// See https://make.wordpress.org/themes/handbook/review/required/#selling-credits-and-links
		const fullUrl = createURL( url, queryString );
		await page.goto( fullUrl );

		await unexpectedLinksTest( fullUrl, queryString );
	} );
} );
