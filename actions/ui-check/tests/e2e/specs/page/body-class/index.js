/**
 * Internal dependencies
 */
import {
	getElementPropertyAsync,
	errorWithMessageOnFail,
} from '../../../../utils';

export default async ( url, bodyClass ) => {
	// Make sure the page content appears to be appropriate for the URL.
	const body = await page.$( 'body' );
	const bodyClassName = await getElementPropertyAsync( body, 'className' );

	return errorWithMessageOnFail(
		`Unable to find body class when loading a page using ${ url }`,
		() => {
			expect( bodyClassName.split( ' ' ) ).toContain( bodyClass );
		}
	);
};
