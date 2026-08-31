/**
 * Internal dependencies
 */
import { test } from '../../fixtures';
import { getFileNameFromPath, getTestUrls, getSiteInfo } from '../../../utils';

import bodyClassTest from './body-class';
import phpErrorsTest from './php-errors';
import completeOutputTest from './complete-output';
import pageStatusTest from './page-status';
import jsErrorTest from './js-errors';
import unexpectedLinksTest from './unexpected-links';
import frontpageTest from './frontpage';
import frontpageTemplateTest from './frontpage-template';

/**
 * Appends the resolved template file name to a URL label.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} urlPath
 * @return {Promise<string>}
 */
const getUrlPathWithTemplate = async ( page, urlPath ) => {
	const template = await page.$eval( '#template', ( el ) => el.value );
	return `${ urlPath } (via: ${ getFileNameFromPath( template ) })`;
};

/**
 * Runs one check in isolation so an unexpected throw doesn't skip the rest.
 *
 * @param {Function} fn The check to run.
 * @return {Promise<void>}
 */
const runCheck = async ( fn ) => {
	try {
		await fn();
	} catch ( ex ) {
		console.log( ex );
	}
};

/* getTestUrls already seeds the list with the homepage feed. */
const urls = getTestUrls();

for ( const [ index, [ url, queryString, bodyClass ] ] of urls.entries() ) {
	test( `Test URL ${ index }: "${ url }${ queryString }"`, async ( {
		page,
		goTo,
		pageErrors,
	} ) => {
		let urlPath = `"${ url }${ queryString }"`;
		const pageResponse = await goTo( url, queryString );

		try {
			urlPath = await getUrlPathWithTemplate( page, urlPath );
		} catch ( ex ) {}

		const text = await pageResponse.text();

		await runCheck( () => bodyClassTest( page, urlPath, bodyClass ) );
		await runCheck( () => phpErrorsTest( urlPath, text ) );
		await runCheck( () => completeOutputTest( urlPath, text ) );
		await runCheck( () => pageStatusTest( urlPath, pageResponse.status() ) );

		// The pageerror listener fires asynchronously; let it settle first.
		await page.waitForTimeout( 200 );
		await runCheck( () => jsErrorTest( urlPath, pageErrors ) );

		await runCheck( () => unexpectedLinksTest( page, urlPath ) );
	} );
}

const homeurl = [ [ '/', '', 'home' ] ];

for ( const [ url, queryString ] of homeurl ) {
	test( `Frontpage "${ url }${ queryString }"`, async ( { page, goTo } ) => {
		let urlPath = `"${ url }${ queryString }"`;
		await goTo( url, queryString );

		try {
			urlPath = await getUrlPathWithTemplate( page, urlPath );
		} catch ( ex ) {}

		await runCheck( () => frontpageTest( page, urlPath ) );
		await runCheck( () => frontpageTemplateTest( page, urlPath ) );
	} );
}

/* Theme and author URIs are external; sanitizeSiteInfo has restricted them to http(s). */
const siteInfo = getSiteInfo();

for ( const [ index, themeUrl ] of siteInfo.theme_urls.entries() ) {
	test( `Theme URL ${ index }: "${ themeUrl }"`, async ( { page } ) => {
		const response = await page.goto( themeUrl );
		await pageStatusTest( themeUrl, response.status() );
	} );
}
