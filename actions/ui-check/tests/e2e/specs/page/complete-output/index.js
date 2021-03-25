/**
 * Internal dependencies
 */
import { errorWithMessageOnFail } from '../../../../utils';

export default async ( url, responseText ) => {
	return errorWithMessageOnFail(
		`${ url } contains incomplete output. Make sure the page contains valid html.`,
		'page-should-have-complete-output',
		() => {
			expect( responseText ).toMatch( /<\/(html|rss)>\s*$/ );
		}
	);
};
