let interceptionInitialized = false;

export const interceptRequest = ( content, url ) => {
	if ( ! interceptionInitialized ) {
		interceptionInitialized = true;
		page.setRequestInterception( true );
		page.on( 'request', ( request ) => {
			if ( request.url() === url ) {
				request.respond( {
					status: 200,
					contentType: 'text/html; charset=utf-8',
					body: content,
				} );
			} else {
                request.continue();
            }
		} );
	}
};
