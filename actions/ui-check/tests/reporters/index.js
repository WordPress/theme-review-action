/**
 * External dependencies
 */
const fs = require( 'fs' );

/**
 * Internal dependencies
 */
const getResultObject = require( './utils' ).getResultObject;

/**
 * Modules constants
 */
const ERROR_DOCS_URL =
	'https://github.com/WordPress/theme-review-action/blob/trunk/docs/ui-errors.md';
const WARNING_DOCS_URL =
	'https://github.com/WordPress/theme-review-action/blob/trunk/docs/ui-warnings.md';

/**
 * Returns an item template string.
 *
 * @param {string} url
 * @param {string} message
 * @returns
 */
const getTemplate = ( key, obj ) => `Test Name: ${ obj.title }

Details: 
${
	Object.keys( obj.details ).length > 0
		? Object.keys( obj.details ).join( '\n' )
		: 'None provided.'
}

Help: 
${ getDocInformation( obj.severity, key ) }

`;

/**
 * Returns a message that suggest documentation for help.
 *
 * @param {string} type Errors or Warnings
 * @param {string} testId The id of the test that matches the documentation
 * @returns {string}
 */
const getDocInformation = ( type, testId ) => {
	let docsURL = type === 'errors' ? ERROR_DOCS_URL : WARNING_DOCS_URL;

	return `${ docsURL }#${ testId }`;
};

const printToLog = ( log, items ) => {
	fs.appendFileSync(
		`../../logs/ui-check-${ log }.txt`,
		[ ...items ].join( '\n' ),
		{
			encoding: 'utf8',
		}
	);
};

class MyCustomReporter {
	constructor( globalConfig, options ) {
		this._globalConfig = globalConfig;
		this._options = options;

		this.errors = [];
	}

	onTestResult( test, { testResults } ) {
		for ( var i = 0; i < testResults.length; i++ ) {
			const result = testResults[ i ];

			if ( result.status === 'failed' ) {
				this.errors = getResultObject( result );
			}
		}
	}

	onRunComplete( contexts, results ) {
		const warnings = [];
		const errors = [];

		// Collect the warnings and errors respectively
		Object.keys( this.errors ).forEach( ( key ) => {
			if ( this.errors[ key ].severity === 'warnings' ) {
				warnings.push( getTemplate( key, this.errors[ key ] ) );
			} else {
				errors.push( getTemplate( key, this.errors[ key ] ) );
			}
		} );

		if ( warnings.length ) {
			printToLog( 'warnings', warnings );
		}

		if ( errors.length ) {
			printToLog( 'errors', errors );
		}

		console.log(
			'\n\nCompleted test run. See logs for test result details.\n'
		);
	}
}

module.exports = MyCustomReporter;
