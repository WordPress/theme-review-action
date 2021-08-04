/**
 * Internal dependencies
 */
import { errorWithMessageOnFail } from '../../../../utils';

export default async ( url, status ) => {
	return errorWithMessageOnFail(
		`Expected to received a 200 status for ${ url }. Received ${ status }.`,
		() => {
			expect( status ).toBe( 200 );
		}
	);
};
