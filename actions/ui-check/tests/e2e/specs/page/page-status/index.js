/**
 * Internal dependencies
 */
import { errorWithMessageOnFail } from '../../../../utils';

export default async ( url, status ) => {
	return errorWithMessageOnFail(
		`Expected to received a 200 status for ${ url }. Received ${ status }.`,
		'page-should-return-200-status',
		() => {
			expect( status ).toMatch( /^(200|304)$/ );
		}
	);
};
