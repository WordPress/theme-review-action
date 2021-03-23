const fs = require( 'fs' );

import { createURL } from './environment';
import { OUTPUT_HTML_FOLDER_PATH } from './paths';

export const goTo = async ( url, queryString = '' ) => {
	let response = await page.goto( createURL( url, queryString ) );
	let content = await response.text();

	let path = [
		OUTPUT_HTML_FOLDER_PATH,
		url.replace( '/', 'home' ) + queryString
	];



	fs.writeFileSync( `${ path.join( '/' ) }.html`, content );

	return response;
};
