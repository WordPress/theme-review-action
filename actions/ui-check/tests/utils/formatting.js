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
