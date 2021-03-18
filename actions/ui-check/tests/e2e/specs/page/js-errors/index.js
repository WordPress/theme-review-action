/**
 * Internal dependencies
 */
import { errorWithMessageOnFail } from '../../../../utils';

export default async ( url ) => {
	let jsError;

	page.on( 'pageerror', ( error ) => {
		// Replace too many extra spaces, replace new line characters
		jsError = error
			.toString()
			.replace( / +(?= )/g, '' )
			.replace( /\n/g, ' ' );
	} );

	return errorWithMessageOnFail(
		`Page should not contain javascript errors. Found ${ jsError }`,
		'browser-console-should-not-contain-errors',
		() => {
			expect( jsError ).toBeFalsy();
		}
	);
};
