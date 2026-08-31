/**
 * Internal dependencies
 */
import { expect } from '../../../fixtures';
import { errorWithMessageOnFail, removeLocalPathRefs } from '../../../../utils';

export default async ( url, pageErrors ) => {
	const jsError = pageErrors
		.join( ' ' )
		.replace( / +(?= )/g, '' )
		.replace( /\n/g, ' ' );

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
