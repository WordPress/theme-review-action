/**
 * Internal dependencies
 */
import { expect } from '../../../fixtures';
import { errorWithMessageOnFail, getFileNameFromPath } from '../../../../utils';

export default async ( page, url ) => {
	const template = await page.$eval( '#template', ( el ) => el.value );
	const filename = getFileNameFromPath( template );

	return errorWithMessageOnFail(
		`${ url } Frontpage template file must not be page.php`,
		'frontpage-should-show-correct-content',
		() => {
			expect( filename ).not.toBe( 'page.php' );
		}
	);
};
