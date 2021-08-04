/**
 * Removes some noise that exists in the testing framework error messages.
 * @param {string} msg Error message thrown by testing framework.
 * @returns {string}
 */
export const cleanErrorMessage = ( msg ) => {
	return msg
		.replace( 'expect(received).toPassAxeTests(expected)', '' )
		.replace( 'Expected page to pass Axe accessibility tests.', '' )
		.replace( /^\s*$(?:\r\n?|\n)/, '\n' );
};

/**
 *
 * @param {string} type Message type. Ie: errors, warnings, info
 * @param {string|string[]} message Messages to display
 * @param {function} testToRun The test that will be executed
 * @returns {bool} Whether the test has passed(true) or not(false).
 */
const expectWithMessage = ( type, message, testToRun ) => {
	try {
		testToRun();
		return true;
	} catch ( e ) {
		const output = Array.isArray( message ) ? message : [ message ];

		if ( ! process.env.DEV_MODE ) {
			throw new Error( `[[[${ type }]]] {{{ ${ output } }}} ` );
		} else if ( process.env.SANITY_MODE ) {
			// No need to do anything
			// We expect tests to fail and don't want that to appear as test failures.
		} else {
			throw new Error( e );
		}

		return false;
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
