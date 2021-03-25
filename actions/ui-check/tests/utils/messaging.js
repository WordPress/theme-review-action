const fs = require( 'fs' );
import { ERROR_DOCS_URL, WARNING_DOCS_URL } from './index';

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
 * Joins and appends lines to log file
 * @param {array} lines
 */
const appendToLog = ( command, lines ) => {
	const path = `../../logs/ui-check-${ command }.txt`;

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
	appendToLog( command, lines );
};

/**
 * Returns a message that suggest documentation for help.
 *
 * @param {string} type Errors or Warnings
 * @param {*} testId The id of the test that matches the documentation
 * @returns {string}
 */
const getDocInformation = ( type, testId ) => {
	let docsURL = type === 'errors' ? ERROR_DOCS_URL : WARNING_DOCS_URL;

	return `See: ${ docsURL }#${ testId }`;
};

/**
 *
 * @param {string} type Message type. Ie: errors, warnings, info
 * @param {string|string[]} message Messages to display
 * @param {function} testToRun The test that will be executed
 * @returns {bool} Whether the test has passed(true) or not(false).
 */
const expectWithMessage = ( type, message, testId, testToRun ) => {
	const output = Array.isArray( message ) ? message : [ message ];

	if ( testId ) {
		// Append information about the error.
		output.push( getDocInformation( type, testId ) );
	}

	try {
		testToRun();
		return true;
	} catch ( e ) {
		if ( ! process.env.DEV_MODE ) {
			printMessage( type, output );
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
export const errorWithMessageOnFail = ( message, testId = false, test ) => {
	return expectWithMessage( 'errors', message, testId, test );
};

/**
 * Outputs messages as warning
 * @param {string|string[]} message Messages to output
 * @param {function} test Function to run
 */
export const warnWithMessageOnFail = ( message, testId = false, test ) => {
	return expectWithMessage( 'warnings', message, testId, test );
};
