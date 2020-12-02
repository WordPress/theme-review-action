const core = require( '@actions/core' );
const fs = require( 'fs' );

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

const appendToLog = ( lines ) => {
	const path = '../../logs/ui-check.txt';

	fs.appendFileSync( path, [ '\n\n', ...lines ].join( '\n' ), {
		encoding: 'utf8',
	} );
};

/**
 * Prints a message
 * @param {string} command The name of the command that matches the `core` library messaging commands.
 * @param {string[]} lines The content to print.
 */
export const printMessage = ( command, lines ) => {
	// Github actions should automatically set CI
    // If we are not running in github, create our own log file and write to it.
    console.log( process.env.CI)
	if ( ! process.env.CI ) {
        appendToLog( lines );
        console.log(' appending line')
		return;
	}
    console.log(' using core');

	core[ command ]( lines.join( '\n\n' ) );
};

/**
 *
 * @param {string} type @github/core message type. Ie: setFailed, warning, info
 * @param {string|string[]} message Messages to display
 * @param {function} testToRun The test that will be executed
 */
const expectWithMessage = ( type, message, testToRun ) => {
	const output = Array.isArray( message ) ? message : [ message ];

	try {
		testToRun();
	} catch ( e ) {
		printMessage( type, output );
	}
};

/**
 * Outputs messages as error
 * @param {string|string[]} message Messages to output
 * @param {function} test Function to run
 */
export const errorWithMessageOnFail = ( message, test ) => {
	return expectWithMessage( 'setFailed', message, test );
};

/**
 * Outputs messages as warning
 * @param {string|string[]} message Messages to output
 * @param {function} test Function to run
 */
export const warnWithMessageOnFail = ( message, test ) => {
	return expectWithMessage( 'warning', message, test );
};
