/**
 * Internal dependencies
 */
import { warnWithMessageOnFail, FailedTestException } from '../../../../utils';

/**
 * Tests whether the theme has legitimate skip links
 *
 * See https://make.wordpress.org/themes/handbook/review/required/#skip-links
 */
const test = async () => {
	await page.keyboard.press( 'Tab' );

	const activeElement = await page.evaluate( () => {
		const el = document.activeElement;

		return {
			tag: el.tagName,
			text: el.innerText,
			hash: el.hash,
			isVisible: el.offsetHeight > 0 && el.offsetWidth > 0,
		};
	} );

	try {
		expect( activeElement.tag.toLowerCase() ).toEqual( 'a' );
		expect(
			activeElement.hash.toLowerCase().indexOf( '#' ) >= 0
		).toBeTruthy();
	} catch ( e ) {
		throw new FailedTestException( [
			'Unable to find a legitimate skip link. Make sure your theme includes skip links where necessary.',
		] );
	}

	try {
		// Expect the anchor tag to have a matching element
		const el = await page.$( activeElement.hash );

		expect( el ).not.toBeNull();
	} catch ( e ) {
		throw new FailedTestException( [
			"The skip link doesn't have a matching element on the page.",
			`Expecting to find an element with an id matching: "${ activeElement.hash.replace(
				'#',
				''
			) }".`,
		] );
	}

	return true;
};

export default async () => {
	try {
		return await test();
	} catch ( ex ) {
		if ( ex instanceof FailedTestException ) {
			return warnWithMessageOnFail( ex.messages, () => {
				expect( false ).toEqual( true );
			} );
		} else {
			console.log( ex );
		}
	}
};
