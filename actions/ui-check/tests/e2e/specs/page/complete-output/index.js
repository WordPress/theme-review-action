/**
 * Internal dependencies
 */
import { errorWithMessageOnFail } from '../../../../utils';

export default async ( url, responseText ) => {
	return errorWithMessageOnFail(
		`Loading a page using ${ url } contains incomplete output. Make sure the page contains valid html.`,
		() => {
			expect( responseText ).toMatch( /<\/(html|rss)>\s*$/ );
		}
	);
};
