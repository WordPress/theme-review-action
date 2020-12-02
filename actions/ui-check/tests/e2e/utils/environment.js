export const isDebugMode = () => process.env.UI_DEBUG;
export const testPort = process.env.WP_ENV_TESTS_PORT;

export const createURL = ( path, query ) => {
	let base = `http://localhost:${ testPort }${ path }`;

	if ( query ) {
		base += `?${ query }`;
	}

	return base;
};
