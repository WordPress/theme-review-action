/**
 * Internal dependencies
 */
import { errorWithMessageOnFail, removeLocalPathRefs } from '../../../../utils';

let jsError;
page.on( 'pageerror', ( error ) => {
	// Replace too many extra spaces, replace new line characters
	jsError = error
		.toString()
		.replace( / +(?= )/g, '' )
		.replace( /\n/g, ' ' );
} );

export default async ( url ) => {
	console.log( jsError );

	console.log( removeLocalPathRefs( jsError ) );

	return errorWithMessageOnFail(
		`${ url } should not contain javascript errors. Found ${ jsError }`,
		'browser-console-should-not-contain-errors',
		() => {
			expect( jsError ).toBeFalsy();
		}
	);
};
