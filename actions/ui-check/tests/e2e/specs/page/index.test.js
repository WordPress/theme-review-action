/**
 * External dependencies
 */
import { getPageError } from '@wordpress/e2e-test-utils';
const fetch = require( 'node-fetch' );

/**
 * Internal dependencies
 */
import {
	createURL,
	getDefaultUrl,
	errorWithMessageOnFail,
	getElementPropertyAsync,
} from '../../../utils';

import site_info from '../../../../../../config/siteinfo.json';

// Some URLs like feeds aren't included in the site map.
// TODO: should we test those separately? Not all of these tests are appropriate.
let urls = [ [ '/', '?feed=rss2', '' ], ...site_info.site_urls ];

const removeWWW = ( str ) => {
	return str.replace( /^(www[.])/, '' );
};

// Some basic tests that apply to every page
describe.each( urls )( 'Test URL %s%s', ( url, queryString, bodyClass ) => {
	it( 'Page should contain body class ' + bodyClass, async () => {
		// Make sure the page content appears to be appropriate for the URL.
		await page.goto( createURL( url, queryString ) );
		const body = await page.$( 'body' );
		const bodyClassName = await getElementPropertyAsync(
			body,
			'className'
		);

		errorWithMessageOnFail(
			`${ url } does not contain a body class`,
			() => {
				expect( bodyClassName.split( ' ' ) ).toContain( bodyClass );
			}
		);
	} );

	it( 'Page should not have PHP errors', async () => {
		await page.goto( createURL( url, queryString ) );
		const pageError = await getPageError();

		errorWithMessageOnFail(
			`Page contains PHP errors: ${ JSON.stringify( pageError ) }`,
			() => {
				expect( pageError ).toBe( null );
			}
		);
	} );

	it( 'Page should have complete output', async () => {
		// This should catch anything that kills output before the end of the page, or outputs trailing garbage.
		let response = await page.goto( createURL( url, queryString ) );
		const responseText = await response.text();

		errorWithMessageOnFail(
			`Page contains incomplete output: ${ JSON.stringify(
				responseText
			) }`,
			() => {
				expect( responseText ).toMatch( /<\/(html|rss)>\s*$/ );
			}
		);
	} );

	it( 'Page should return 200 status', async () => {
		let response = await page.goto( createURL( url, queryString ) );
		const status = await response.status();

		errorWithMessageOnFail(
			`Expected to received a 200 status for ${ url }. Received ${ status }.`,
			() => {
				expect( status ).toBe( 200 );
			}
		);
	} );

	it( 'Browser console should not contain errors', async () => {
		// Haven't confirmed this works
		let jsError;

		page.on( 'pageerror', ( error ) => {
			jsError = error.toString();
		} );

		await page.goto( createURL( '/' ) );

		errorWithMessageOnFail(
			`Page should not contain javascript errors. Found ${ JSON.stringify(
				jsError
			) }`,
			() => {
				expect( jsError ).toBeFalsy();
			}
		);
	} );

	it( 'Page should not have unexpected links', async () => {
		// See https://make.wordpress.org/themes/handbook/review/required/#selling-credits-and-links

		await page.goto( createURL( url, queryString ) );

		const hrefs = await page.$$eval( 'a', ( anchors ) =>
			[].map.call( anchors, ( a ) => a.href )
		);

		const allowed_hosts = [
			'wordpress.org',
			'gravatar.com',
			'en.support.wordpress.com',
			'example.com',
			'example.org',
			'example.net',
			'wpthemetestdata.wordpress.com',
			'wpthemetestdata.files.wordpress.com',
			'tellyworth.wordpress.com', // in the theme test data as a comment
			'codex.wordpress.org',
			'gnu.org', // In the test data
			'youtube.com', // In the test data
			'brainyquote.com', // In the test data
			'facebook.com',
			'twitter.com',
			'pinterest.com',
			'linkedin.com',
			'google.com',
			't.co', // in embedded content
			'', // mailto
			new URL( page.url() ).hostname,
			...site_info.theme_urls.map( ( link ) =>
				removeWWW( new URL( link ).hostname )
			),
			...site_info.content_urls.map( ( link ) =>
				removeWWW( new URL( link ).hostname )
			),
		];

		// TODO: improve this so that instead of including a blanket exception for facebook.com and the theme/author hostnames,
		// we have a separate whitelist containing URLs like https://facebook.com/sharing.php etc.
		hrefs.forEach( ( href ) => {
			let href_url = new URL( href, page.url() );
			let hostname = removeWWW( href_url.hostname );
			errorWithMessageOnFail(
				`${ hostname } found on ${ getDefaultUrl(
					url,
					queryString.replace( '?', '' )
				) } is not an approved link.`,
				() => {
					expect( allowed_hosts ).toContain( hostname );
				}
			);
		} );
	} );
} );
