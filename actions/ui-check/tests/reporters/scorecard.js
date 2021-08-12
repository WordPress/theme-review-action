/**
 * External dependencies
 */
const fs = require( 'fs' );

/**
 * Internal dependencies
 */
const getResultObject = require( './utils' ).getResultObject;

class ScorecardReporter {
	constructor() {
		this.errors = {};
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
		const filename = '../../logs/theme-scorecard.json';

		// The following assumes that there isn't an async task writing to the log.
		// The log should be final.
		const scorecard = fs.readFileSync( filename, { encoding: 'utf8' } );
		const parsed = JSON.parse( scorecard );

		Object.keys( this.errors ).map( ( key ) => {
			parsed[ key ] = 0;
		} );

		fs.writeFileSync( filename, JSON.stringify( parsed ) );
	}
}

module.exports = ScorecardReporter;
