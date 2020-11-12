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
 * Returns a formatted version of the url.
 * @param {string} path Url of the page.
 * @param {string} query The query string of the url.
 * @returns {string}
 */
export const getDefaultUrl = ( path, query ) => {
	let defaultUrl = path;

	if ( query.length > 1 ) {
		defaultUrl += `?${ query }`;
	}

	return `(${ defaultUrl })`;
};
