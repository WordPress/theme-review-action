/** 
 * External dependencies 
 * */

import { getPageError } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	errorWithMessageOnFail,
} from '../../../../utils';

export default async () => {
	const pageError = await getPageError();

	return errorWithMessageOnFail(
		`Page contains PHP errors: ${ pageError }`,
		'page-should-not-have-php-errors',
		() => {
			expect( pageError ).toBe( null );
		}
	);
};
