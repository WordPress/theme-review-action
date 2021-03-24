export const isDebugMode = () =>
	process.env.UI_DEBUG || process.env.UI_DEBUG === 'true';
export const testPort = process.env.WP_ENV_TESTS_PORT || 8889;

export const getEnvironmentVariable = ( variable ) => {
	return variable || false;
};

export const createURL = ( path, query ) => {
	let base = `http://localhost:${ testPort }${ path }`;

	if ( query ) {
		base += query[ 0 ] !== '?' ? `?${ query }` : query;
	}

	return base;
};

export const getSiteInfo = () => {
	let siteInfo = {
		content_urls: [],
		site_urls: [],
		theme_urls: [],
	};

	try {
		siteInfo = {
			...siteInfo,
			...require( '../../../../config/siteinfo.json' ),
		};
	} catch ( e ) {}

	return siteInfo;
};

export const getTestUrls = () => {
	const siteInfo = getSiteInfo();

	return [ [ '/', '?feed=rss2', '' ], ...siteInfo.site_urls ];
};

/**
 * Custom Error type to be throw in tests
 *
 * @param {string[]} messages
 */
export function FailedTestException( messages ) {
	this.messages = messages;
}
