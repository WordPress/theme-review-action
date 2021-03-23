/**
 * External dependencies
 * */
import site_info from '../../../../../../../config/siteinfo.json';

/**
 * Internal dependencies
 */
import { errorWithMessageOnFail } from '../../../../utils';
import { getDefaultUrl } from '../../../../utils';

const removeWWW = ( str ) => {
	return str.replace( /^(www[.])/, '' );
};

export default async ( url, queryString ) => {
	let passed = true;

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

	hrefs.forEach( ( href ) => {
		let href_url = new URL( href, page.url() );
		let hostname = removeWWW( href_url.hostname );
		const result = errorWithMessageOnFail(
			`${ hostname } found on ${ getDefaultUrl(
				url,
				queryString.replace( '?', '' )
			) } is not an approved link.`,
			'page-should-not-have-unexpected-links',
			() => {
				expect( allowed_hosts ).toContain( hostname );
			}
		);

		if ( ! result ) {
			passed = false;
		}
	} );

	return passed;
};