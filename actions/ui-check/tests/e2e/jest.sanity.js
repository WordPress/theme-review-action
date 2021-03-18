let configs = {
	...require( '@wordpress/scripts/config/jest-e2e.config' ),
	testTimeout: 1000000,
	verbose: true,
	testMatch: [
		'**/sanity/**/[^.]+.test.[jt]s',
	],
};

module.exports = configs;