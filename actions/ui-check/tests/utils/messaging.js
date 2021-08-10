/**
 *
 * @param {string} type Message type. Ie: errors, warnings, info
 * @param {string|string[]} message Messages to display
 * @param {function} testToRun The test that will be executed
 * @returns {bool} Whether the test has passed(true) or not(false).
 */
const expectWithMessage = ( type, message, testToRun ) => {
	// Dev mode is considered the default jest environment
	if ( process.env.DEV_MODE ) {
		testToRun();
		return;
	}

	// Custom handling of error messages
	// This is interpreted by a custom reporter (../reporters)
	try {
		testToRun();

		// We return true because the tests are also used for sanity checks
		// which assume the test either pass or fail
		return true;
	} catch ( e ) {
		// Sanity tests only care about whether the test failed or not
		if ( process.env.SANITY_MODE ) {
			return false;
		}

		throw new Error( `[[[${ type }]]] {{{ ${ message } }}} ` );
	}
};

/**
 * Outputs messages as error
 * @param {string|string[]} message Messages to output
 * @param {function} test Function to run
 */
export const errorWithMessageOnFail = ( message, test ) => {
	return expectWithMessage( 'errors', message, test );
};

/**
 * Outputs messages as warning
 * @param {string|string[]} message Messages to output
 * @param {function} test Function to run
 */
export const warnWithMessageOnFail = ( message, test ) => {
	return expectWithMessage( 'warnings', message, test );
};
