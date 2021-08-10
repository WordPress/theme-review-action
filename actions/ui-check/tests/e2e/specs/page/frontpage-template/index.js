/**
 * Internal dependencies
 */
import { errorWithMessageOnFail, getFileNameFromPath } from '../../../../utils';

export default async ( url ) => {
	let template, filename;

	try {
		template = await page.$eval( '#template', ( el ) => el.value );
		filename = getFileNameFromPath( template );
	} catch ( ex ) {}

	return errorWithMessageOnFail(
		`Frontpage template file must not be page.php`,
		() => {
			expect( filename ).not.toBe( 'page.php' );
		}
	);
};
