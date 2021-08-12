const getResultObject = ( result ) => {
	const errors = {};

	const id = result.title.replace( / /g, '_' ).toLowerCase();

	//result.ancestorTitles -> the page id
	if ( ! errors[ id ] ) {
		errors[ id ] = {};
		errors[ id ].title = result.title;
		errors[ id ].pages = [];
		errors[ id ].details = {};
		errors[ id ].severity = '';
	}

	// Get the error type
	const errorTypeRegex = /\[\[\[(.*)]]]/g;
	const typeMatches = errorTypeRegex.exec( result.failureMessages[ 0 ] );

	if ( ! typeMatches || ! typeMatches[ 1 ] ) {
		return;
	}

	// // Get the error message
	const regex = /{{{([\s\S]*?)}}}/g;
	const matches = regex.exec( result.failureMessages[ 0 ] );

	if ( matches && matches[ 1 ] ) {
		errors[ id ].pages.push( `"${ result.ancestorTitles }"` );

		errors[ id ].severity = typeMatches[ 1 ];
		errors[ id ].details[ matches[ 1 ].trim() ] = true;
	}

	return errors;
};

module.exports = {
	getResultObject,
};
