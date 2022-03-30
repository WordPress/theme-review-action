/**
 * Internal dependencies
 */
import {
	getElementPropertyAsync,
	errorWithMessageOnFail,
} from '../../../../utils';

export default async ( url ) => {
	// Make sure the page content appears to be appropriate for the URL.
	const body = await page.$( 'body' );
	const bodyClassName = await getElementPropertyAsync( body, 'className' );

	return errorWithMessageOnFail(
		`${ url } does not contain the blog body class`,
		'frontpage-should-show-correct-content',
		() => {
			expect( bodyClassName.split( ' ' ) ).toContain( 'blog' );
		}
	);
};
