/**
 * External dependencies
 */
const fetch = require( 'node-fetch' );

/**
 * Internal dependencies
 */
import { getFileNameFromPath, getTestUrls, goTo, getSiteInfo } from '../../../utils';

import bodyClassTest from './body-class';
import phpErrorsTest from './php-errors';
import completeOutputTest from './complete-output';
import pageStatusTest from './page-status';
import jsErrorTest from './js-errors';
import unexpectedLinksTest from './unexpected-links';

// Some URLs like feeds aren't included in the site map.
// TODO: should we test those separately? Not all of these tests are appropriate.
let urls = [ [ '/', '?feed=rss2', '' ], ...getTestUrls() ];

const getUrlPathWithTemplate = async ( urlPath ) => {
	const template = await page.$eval( '#template', ( el ) => el.value );
	return `${ urlPath } (via: ${ getFileNameFromPath( template ) })`;
};

// Some basic tests that apply to every page
describe.each( urls )( 'Test URL %s%s', ( url, queryString, bodyClass ) => {
	let pageResponse, urlPath;

	beforeAll( async () => {
		urlPath = `"${ url }${ queryString }"`;
		pageResponse = await goTo( url, queryString );

		try {
			urlPath = await getUrlPathWithTemplate( urlPath );
		} catch ( ex ) {}
	} );

	it( 'Page should contain body class ' + bodyClass, async () => {
		// Make sure the page content appears to be appropriate for the URL.
		await bodyClassTest( urlPath, bodyClass );
	} );

	it( 'Page should not have PHP errors', async () => {
		await phpErrorsTest( urlPath );
	} );

	it( 'Page should have complete output', async () => {
		// This should catch anything that kills output before the end of the page, or outputs trailing garbage.
		const text = await pageResponse.text();
		await completeOutputTest( urlPath, text );
	} );

	it( 'Page should return 200 status', async () => {
		const status = await pageResponse.status();

		await pageStatusTest( urlPath, status );
	} );

	it( 'Browser console should not contain errors', async () => {
		await jsErrorTest( urlPath );
	} );

	it( 'Page should not have unexpected links', async () => {
		// See https://make.wordpress.org/themes/handbook/review/required/#selling-credits-and-links
		await unexpectedLinksTest( urlPath );
	} );
} );

// Test if theme and author URI have a valid responses
const siteInfo = getSiteInfo();
let theme_urls = [...siteInfo.theme_urls];

describe.each( theme_urls )('Test URL %s%s', ( url ) => {
	let pageResponse;

	beforeAll(async () => {
		pageResponse = await page.goto( url );
	});

	it( 'Page should return 200 status', async () => {
		const status = await pageResponse.status();
		await pageStatusTest( url, status );
	});

});
