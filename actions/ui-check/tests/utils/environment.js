export const isDebugMode = () => process.env.UI_DEBUG || process.env.UI_DEBUG === 'true';
export const testPort = process.env.WP_ENV_TESTS_PORT || 8889;

export const getEnvironmentVariable = ( variable ) => {
	return variable || false;
};

export const createURL = ( path, query ) => {
	let base = `http://localhost:${ testPort }${ path }`;

	if ( query ) {
		base += `?${ query }`;
	}

	return base;
};
