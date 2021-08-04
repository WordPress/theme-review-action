/**
 * Internal dependencies
 */
import {
	errorWithMessageOnFail,
	getPageError,
	removeLocalPathRefs,
} from '../../../../utils';

export default async ( url ) => {
	const pageError = await getPageError();

	return errorWithMessageOnFail(
		`${ url } contains PHP errors: ${ removeLocalPathRefs( pageError ) }`,
		() => {
			expect( pageError ).toBe( null );
		}
	);
};
