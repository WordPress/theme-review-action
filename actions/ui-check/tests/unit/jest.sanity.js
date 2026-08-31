let configs = {
	...require( '@wordpress/scripts/config/jest-unit.config' ),
	testTimeout: 1000000,
	verbose: true,
	testMatch: [ '**/unit/**/sanity/index.test.js' ],
};

module.exports = configs;
