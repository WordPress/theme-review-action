import site_info from '../../../../config/siteinfo.json';

export const isDebugMode = () => process.env.UI_DEBUG || process.env.UI_DEBUG === 'true';
export const testPort = process.env.WP_ENV_TESTS_PORT || 8889;

export const getEnvironmentVariable = ( variable ) => {
	return variable || false;
};

export const createURL = ( path, query ) => {
	let base = `http://localhost:${ testPort }${ path }`;

	if ( query ) {
		base += (query[ 0 ] !== '?' ? `?${ query }` : query);
	}

	return base;
};

export const getTestUrls = () => {
    return [ [ '/', '?feed=rss2', '' ], ...site_info.site_urls ];
}


