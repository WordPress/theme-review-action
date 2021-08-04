const fs = require( 'fs' );

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
const getTemplate = ( url, message ) => `URL: ${ url }

${ message }
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

	return `See: ${ docsURL }#${ testId }`;
};

const getLines = ( key, items ) => {
	return items.map(
		( i ) => `- ${ i.message } (${ getDocInformation( key, i.id ) })`
	);
};

const buildTemplate = ( key, items ) => {
	return getTemplate( key, getLines( key, items ).join( '\n' ) );
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

		this.errors = {};
	}

	onTestResult( test, { testResults } ) {
		for ( var i = 0; i < testResults.length; i++ ) {
			const result = testResults[ i ];

			if ( result.status === 'failed' ) {
				//result.ancestorTitles -> the page id
				if ( ! this.errors[ result.ancestorTitles ] ) {
					this.errors[ result.ancestorTitles ] = {};

					if ( ! this.errors[ result.ancestorTitles ].errors ) {
						this.errors[ result.ancestorTitles ].errors = [];
					}
					if ( ! this.errors[ result.ancestorTitles ].warnings ) {
						this.errors[ result.ancestorTitles ].warnings = [];
					}
				}

				// Get the error type
				const errorTypeRegex = /\[\[\[(.*)]]]/g;
				const [ , errorTypeMatch ] = errorTypeRegex.exec(
					result.failureMessages[ 0 ]
				);

				// Get the error message
				const regex = /{{{(.*)}}}/g;
				const [ , match ] = regex.exec( result.failureMessages[ 0 ] );

				this.errors[ result.ancestorTitles ][ errorTypeMatch ].push( {
					id: result.title.replace( / /g, '-' ).toLowerCase(),
					message: match.trim(),
				} );
			}
		}
	}

	onRunComplete( contexts, results ) {
		const warnings = [];
		const errors = [];

		// Collect the warnings and errors respectively
		Object.keys( this.errors ).forEach( ( key ) => {
			if ( this.errors[ key ].warnings.length ) {
				warnings.push(
					buildTemplate( key, this.errors[ key ].warnings )
				);
			}

			if ( this.errors[ key ].errors.length ) {
				errors.push( buildTemplate( key, this.errors[ key ].errors ) );
			}
		} );

		if ( warnings.length ) {
			printToLog( 'warnings', warnings );
		}

		if ( errors.length ) {
			printToLog( 'errors', errors );
		}
	}
}

module.exports = MyCustomReporter;
