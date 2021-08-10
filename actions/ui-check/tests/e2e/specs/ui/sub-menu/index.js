/**
 * Internal dependencies
 */
import {
	warnWithMessageOnFail,
	elementIsVisibleAsync,
	elementIsInViewportAsync,
	FailedTestException,
} from '../../../../utils';

const isVisible = async ( el ) => {
	return (
		( await elementIsVisibleAsync( el ) ) &&
		( await elementIsInViewportAsync( el ) )
	);
};

/**
 * Checks the <li> for a <ul> and runs tests on it
 * @param {Puppeteer|ElementHandle} listItem
 */
const testLiSubMenu = async ( listItem ) => {
	const link = await listItem.$( 'a' );
	const submenu = await listItem.$( 'ul' );

	if ( link !== null && submenu !== null ) {
		// We don't want to test on hidden listItems
		if ( ! ( await elementIsVisibleAsync( link ) ) ) {
			return;
		}

		// Test that hovering works
		await link.hover();

		// Give the hover some time to apply and show up in case of animation
		await new Promise( ( resolve ) => setTimeout( resolve, 500 ) );

		let submenuIsVisible = await isVisible( submenu );

		// If it didn't work on the link, try it with the li
		if ( ! submenuIsVisible ) {
			await listItem.hover();

			submenuIsVisible = await isVisible( submenu );
		}

		if ( ! submenuIsVisible ) {
			throw new FailedTestException(
				'Submenus should be become visible when :hover is added to the navigational menu.'
			);
		}

		//Remove the hover to make the menu disappear
		await page.mouse.move( 0, 0 );

		// Allow some time for the menu to disappear
		await new Promise( ( resolve ) => setTimeout( resolve, 300 ) );

		// Test that focus works
		await link.focus();

		// Give the focus some time to apply and show up in case of animation
		await new Promise( ( resolve ) => setTimeout( resolve, 500 ) );

		if ( ! ( await elementIsVisibleAsync( submenu ) ) ) {
			throw new FailedTestException(
				'Submenus should become visible when :focus is added to the link through the main navigation.'
			);
		}
	}
};

/**
 * Tests whether the theme has an acceptable navigation
 *
 * See https://make.wordpress.org/themes/handbook/review/required/#keyboard-navigation
 */
const test = async () => {
	// Get the all the lists, looking for navigations
	const ulElements = await page.$$( 'ul' );
	for ( let i = 0; i < ulElements.length; i++ ) {
		// We are only interested in sub navs
		const hasSubNavs = ( await ulElements[ i ].$( 'ul' ) ) !== null;

		// We don't have any sub menus, try another ul
		if ( ! hasSubNavs ) {
			continue;
		}

		const listItems = await ulElements[ i ].$$( 'li' );
		for ( let j = 0; j < listItems.length; j++ ) {
			await testLiSubMenu( listItems[ j ] );
		}
	}
	return true;
};

export default async () => {
	try {
		return await test();
	} catch ( ex ) {
		if ( ex instanceof FailedTestException ) {
			warnWithMessageOnFail( ex.messages, () => {
				expect( false ).toEqual( true );
			} );
		} else {
		}

		return false;
	}
};
