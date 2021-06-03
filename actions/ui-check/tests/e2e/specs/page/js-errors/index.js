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
	return errorWithMessageOnFail(
		`${ url } contains javascript errors. Found ${ removeLocalPathRefs(
			jsError
		) }`,
		'browser-console-should-not-contain-errors',
		() => {
			expect( jsError ).toBeFalsy();
		}
	);
};
