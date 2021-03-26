/**
 * Returns a portion of html if outerHtml is too large
 *
 * @param {string} outerHtml
 * @returns {string}
 */
export const truncateElementHTML = ( outerHtml, maxLength = 200 ) => {
	if ( outerHtml.length > maxLength ) {
		return outerHtml.substring( 0, outerHtml.indexOf( '>' ) + 1 );
	}

	return outerHtml;
};

/**
 * Remove references that are part of a php or js error that include docker environment information
 * @param {string} str String containing stack traces
 * @returns
 */
export const removeLocalPathRefs = ( str ) => {
	if ( ! str ) {
		return;
	}

	const urlRegEx = new RegExp(
		`https?://localhost:?.*?/wp-content/themes/.*?/`,
		'ig'
	);
	const pathRegEx = new RegExp(
		`/var/www/html/wp-content/themes/.*?/`,
		'ig'
	);

	return str.replace( urlRegEx, '' ).replace( pathRegEx, '' );
};
