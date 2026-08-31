/**
 * Internal dependencies
 */
import { expect } from '../../../fixtures';
import {
	warnWithMessageOnFail,
	elementIsVisibleAsync,
	elementIsInViewportAsync,
	FailedTestException,
} from '../../../../utils';

const isVisible = async ( page, el ) => {
	return (
		( await elementIsVisibleAsync( page, el ) ) &&
		( await elementIsInViewportAsync( page, el ) )
	);
};

/**
 * Checks the <li> for a <ul> and runs tests on it
 * @param {import('@playwright/test').Page} page
 * @param {ElementHandle} listItem
 */
const testLiSubMenu = async ( page, listItem ) => {
	const link = await listItem.$( 'a' );
	const submenu = await listItem.$( 'ul' );

	if ( link !== null && submenu !== null ) {
		// We don't want to test on hidden listItems
		if ( ! ( await elementIsVisibleAsync( page, link ) ) ) {
			return;
		}

		// Test that hovering works
		await link.hover();

		// Give the hover some time to apply and show up in case of animation
		await page.waitForTimeout( 500 );

		let submenuIsVisible = await isVisible( page, submenu );

		// If it didn't work on the link, try it with the li
		if ( ! submenuIsVisible ) {
			await listItem.hover();

			submenuIsVisible = await isVisible( page, submenu );
		}

		if ( ! submenuIsVisible ) {
			throw new FailedTestException(
				'Submenus should be become visible when :hover is added to the navigational menu.'
			);
		}

		// Remove the hover to make the menu disappear
		await page.mouse.move( 0, 0 );

		// Allow some time for the menu to disappear
		await page.waitForTimeout( 300 );

		// Test that focus works
		await link.focus();

		// Give the focus some time to apply and show up in case of animation
		await page.waitForTimeout( 500 );

		if ( ! ( await elementIsVisibleAsync( page, submenu ) ) ) {
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
 *
 * @param {import('@playwright/test').Page} page
 */
const runTest = async ( page ) => {
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
			await testLiSubMenu( page, listItems[ j ] );
		}
	}
	return true;
};

export default async ( page ) => {
	try {
		return await runTest( page );
	} catch ( ex ) {
		if ( ex instanceof FailedTestException ) {
			warnWithMessageOnFail(
				ex.messages,
				'should-have-appropriate-submenus',
				() => {
					expect( false ).toEqual( true );
				}
			);
		} else {
			console.log( ex );
		}

		return false;
	}
};
