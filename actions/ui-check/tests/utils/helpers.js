/**
 * Regular expression matching a displayed PHP error within a markup string.
 *
 *
 * @type {RegExp}
 */
const REGEXP_PHP_ERROR = /(<b>)?(Fatal error|Recoverable fatal error|Warning|Parse error|Notice|Strict Standards|Deprecated|Unknown error)(<\/b>)?: ([\s\S]*?) in ([\s\S]*?) on line (<b>)?\d+(<\/b>)?/;

/**
 * Returns a promise resolving to one of either a string or null. A string will
 * be resolved if an error message is present in the contents of the page. If no
 * error is present, a null value will be resolved instead. This requires the
 * environment be configured to display errors.
 *
 * @see http://php.net/manual/en/function.error-reporting.php
 *
 * @return {Promise<?string>} Promise resolving to a string or null, depending
 *                            whether a page error is present.
 */
export async function getErrorFromPage( content ) {
	const match = content.match( REGEXP_PHP_ERROR );
	return match ? match[ 0 ] : null;
}
