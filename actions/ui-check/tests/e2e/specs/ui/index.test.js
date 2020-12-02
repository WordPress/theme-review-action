/**
 * External dependencies
 */
const fs = require( 'fs' );
const PNG = require( 'pngjs' ).PNG;
const pixelmatch = require( 'pixelmatch' );

/**
 * Internal dependencies
 */
import {
	createURL,
	printMessage,
	meetsChangeThreshold,
	getPercentOfOpaqueness,
	getFocusableElementsAsync,
	truncateElementHTML,
	elementIsVisibleAsync,
	getTabbableElementsAsync,
	getElementPropertyAsync,
	isDebugMode,
	makeGif,
} from '../../../utils';

const SCREENSHOT_FOLDER_PATH = 'screenshots';
const SCREENSHOT_FOCUS_TEST = `${ SCREENSHOT_FOLDER_PATH }/focus-test`;
const SCREENSHOT_TABBING_TEST = `${ SCREENSHOT_FOLDER_PATH }/tabbing-test`;

/**
 * Custom Error type to be throw in tests
 *
 * @param {string[]} messages
 */
function FailedTestException( messages ) {
	this.messages = messages;
}

/**
 * Tests whether the theme has legitimate skip links
 *
 * See https://make.wordpress.org/themes/handbook/review/required/#skip-links
 */
const testSkipLinks = async () => {
	await page.goto( createURL( '/' ) );
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
			'[ Accessibility - Skip Link Test ]:',
			"This tests whether the first 'tabbable' element on the page is a skip link with an '#' symbol.",
			'[ Result ]',
			'Page: "/"',
			'Unable to find a legitimate skip link. Make sure your theme includes skip links where necessary.',
			'You can read more about our expectations at https://make.wordpress.org/themes/handbook/review/required/#skip-links.',
		] );
	}

	try {
		// Expect the anchor tag to have a matching element
		const el = await page.$( activeElement.hash );

		expect( el ).not.toBeNull();
	} catch ( e ) {
		throw new FailedTestException( [
			'[ Accessibility - Required Tests ]:',
			'Running tests on "/".',
			"This tests whether the first 'tabbable' element on the page is a skip link that has a matching element to navigate to.",
			'[ Result ]',
			"The skip link doesn't have a matching element on the page.",
			`Expecting to find an element with an id matching: "${ activeElement.hash.replace(
				'#',
				''
			) }".`,
			'See https://make.wordpress.org/themes/handbook/review/required/#skip-links for more information.',
		] );
	}
};

/**
 * Checks the <li> for a <ul> and runs tests on it
 * @param {Puppeteer|ElementHandle} listItem
 */
const testLiSubMenu = async ( listItem ) => {
	const getFailureMessage = ( message ) => [
		'[ Accessibility - Submenu Test ]:',
		'This tests whether your navigational menus are accessible and working as expected.',
		'[ Result ]',
		'Page: "/"',
		"Your theme's navigation is not working as expected.",
		message,
		'This test assumes your menu structure follows these guidelines: https://www.w3.org/WAI/tutorials/menus/structure.',
		'See https://make.wordpress.org/themes/handbook/review/required/#keyboard-navigation for more information.',
	];

	const link = await listItem.$( 'a' );
	const submenu = await listItem.$( 'ul' );

	if ( link !== null && submenu !== null ) {
		// This is commented out for the moment since this rules has not been enforced recently. We may want to turn it back on in the future
		// var usesDisplayNone = await page.evaluate(
		// 	( e ) => getComputedStyle( e ).display.toLowerCase() === 'none',
		// 	submenu
		// );

		// if ( usesDisplayNone ) {
		// 	throw new FailedTestException(
		// 		getFailureMessage(
		// 			'Submenus should not be hidden using `display: none`. Use `position: absolute` instead.'
		// 		)
		// 	);
		// }

		// Test that hovering works
		await link.hover();

		// Give the hover some time to apply and show up in case of animation
		await new Promise( ( resolve ) => setTimeout( resolve, 500 ) );

		let submenuIsVisible = await elementIsVisibleAsync( submenu );

		// If it didn't work on the link, try it with the li
		if ( ! submenuIsVisible ) {
			await listItem.hover();

			submenuIsVisible = await elementIsVisibleAsync( submenu );
		}

		if ( ! submenuIsVisible ) {
			throw new FailedTestException(
				getFailureMessage(
					'Submenus should be become visible when :hover is added to the navigational menu.'
				)
			);
		}

		// Remove the hover to make the menu disappear
		await page.mouse.move( 0, 0 );

		// Allow some time for the menu to disappear
		await new Promise( ( resolve ) => setTimeout( resolve, 300 ) );

		// Test that focus works
		await link.focus();

		// Give the focus some time to apply and show up in case of animation
		await new Promise( ( resolve ) => setTimeout( resolve, 500 ) );

		if ( ! ( await elementIsVisibleAsync( submenu ) ) ) {
			throw new FailedTestException(
				getFailureMessage(
					'Submenus should become visible when :focus is added to the link through the main navigation.'
				)
			);
		}
	}
};

/**
 * Tests whether the theme has an acceptable navigation
 *
 * See https://make.wordpress.org/themes/handbook/review/required/#keyboard-navigation
 */
const testSubMenus = async () => {
	await page.goto( createURL( '/' ) );

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
};

/**
 * Determines whether the element has an acceptable focus state
 * @param {Puppeteer|ElementHandle} element
 * @returns {boolean}
 */
const hasAcceptableFocusState = async ( element ) => {
	// Grab the element dimension
	const dimensions = await element.boundingBox();

	// It's a hidden element
	if (
		dimensions === null ||
		dimensions.x < 0 ||
		dimensions.y < 0 ||
		dimensions.width === 0 ||
		dimensions.height === 0
	) {
		return true;
	}

	// Take a screenshot before focus
	const beforeSnap = await page.screenshot();

	// Set focus to the element
	await element.focus();

	// We give it a few ms in case there is an animation
	await new Promise( ( resolve ) => setTimeout( resolve, 300 ) );

	// Take a screenshot after focus
	const afterSnap = await page.screenshot();

	// Compare images, create diff
	const beforeImg = PNG.sync.read( beforeSnap );
	const afterImg = PNG.sync.read( afterSnap );

	// Use the first image to determine size
	const { width, height } = beforeImg;
	const diff = new PNG( { width, height } );

	// Create a png with the diff overlayed on a transparent background
	// The threshold controls how 'different' the new state should be. ( 0 Low/1 High )
	pixelmatch( beforeImg.data, afterImg.data, diff.data, width, height, {
		threshold: 0.1,
		diffMask: true,
	} );

	// Check to see that there is an acceptable level of change from before & after element focus
	const passes = meetsChangeThreshold( getPercentOfOpaqueness( diff.data ) );

	//Save the images if the element doesn't pass
	if ( ! passes ) {
		if ( ! fs.existsSync( SCREENSHOT_FOCUS_TEST ) ) {
			fs.mkdirSync( SCREENSHOT_FOCUS_TEST );
		}

		//Save an image of the element
		await element.screenshot( {
			path: `${ SCREENSHOT_FOCUS_TEST }/element.png`,
		} );

		// Save after screenshot
		fs.writeFileSync(
			`${ SCREENSHOT_FOCUS_TEST }/page.png`,
			PNG.sync.write( afterImg )
		);
	}

	return passes;
};

/**
 * Loops through focusable elements and compares if focus state to its default state.
 */
const testElementFocusState = async () => {
	await page.goto( createURL( '/' ) );

	const elements = await getFocusableElementsAsync();

	for ( let i = 0; i < elements.length; i++ ) {
		const passes = await hasAcceptableFocusState( elements[ i ] );

		if ( ! passes ) {
			const domElement = await getElementPropertyAsync(
				elements[ i ],
				'outerHTML'
			);

			// Break out of the loop forcefully
			throw new FailedTestException( [
				'[ Accessibility - Element Focus Test ]:',
				"This tests that all 'focusable' elements have a visible :focus state.",
				'[ Result ]',
				'Page: "/"',
				`The element "${ truncateElementHTML(
					domElement,
					300
				) }" does not have enough visible difference when focused. `,
				'Download the screenshots to see the offending element.',
				'See https://make.wordpress.org/themes/handbook/review/required/#keyboard-navigation for more information.',
			] );
		}
	}
};

/**
 * Loops through tabbable elements and test whether the active element in the dom matches our list.
 */
const testForLogicalTabbing = async () => {
	await page.goto( createURL( '/' ) );

	// We turn off these elements because tabbing goes into the control and we don't want to test that
	// `display:none` takes them out of the flow
	await page.addStyleTag( {
		content: 'audio, video, iframe { display: none !important; }',
	} );

	let tabElements = await getTabbableElementsAsync();

	// Let's assume that any issues 50 elements deep are not very concerning
	// It speeds up the tests
	tabElements = tabElements.slice( 0, 50 );

	if ( isDebugMode() ) {
		if ( ! fs.existsSync( SCREENSHOT_TABBING_TEST ) ) {
			fs.mkdirSync( SCREENSHOT_TABBING_TEST );
		}
	}

	for ( let i = 0; i < tabElements.length; i++ ) {
		await page.keyboard.press( 'Tab' );

		// If the elements don't match, we assume the tabbing order is not proper
		const focusMatches = await page.evaluate(
			( el ) => el === document.activeElement,
			tabElements[ i ]
		);

		// This can really slow down the tests, let's only run it in debug
		if ( isDebugMode() ) {
			await page.screenshot( {
				path: `${ SCREENSHOT_TABBING_TEST }/${ i }.jpeg`,
				type: 'jpeg',
				quality: 50,
			} );
		}

		if ( ! focusMatches ) {
			const expectedElement = await getElementPropertyAsync(
				tabElements[ i ],
				'outerHTML'
			);

			const currentFocus = await page.evaluate(
				() => document.activeElement.outerHTML
			);

			throw new FailedTestException( [
				'[ Accessibility - Tabbing Test ]:',
				"This tests that all 'focusable' elements on the page are tabbable in the expected order.",
				'[ Result ]',
				'Page: "/"',
				`Expected: ${ truncateElementHTML( expectedElement, 300 ) }`,
				`Current: ${ truncateElementHTML( currentFocus, 300 ) }`,
				'See https://make.wordpress.org/themes/handbook/review/required/#keyboard-navigation for more information.',
			] );
		}

		// If we don't wait at least 100ms, the test can get out of sync
		await new Promise( ( resolve ) => setTimeout( resolve, 100 ) );
	}
};

describe( 'Accessibility: UI', () => {
	it( 'Should have skip links:', async () => {
		try {
			await testSkipLinks();
		} catch ( ex ) {
			if ( ex instanceof FailedTestException ) {
				printMessage( 'warning', ex.messages );
			} else {
				console.log( ex );
			}
		}
	} );

	it( 'Should have appropriate submenus', async () => {
		try {
			await testSubMenus();
		} catch ( ex ) {
			console.log( ex );
			if ( ex instanceof FailedTestException ) {
				printMessage( 'warning', ex.messages );
			} else {
				console.log( ex );
			}
		}
	} );

	it( 'Should have element focus state', async () => {
		try {
			await testElementFocusState();
		} catch ( ex ) {
			if ( ex instanceof FailedTestException ) {
				printMessage( 'warning', ex.messages );
			} else {
				console.log( ex );
			}
		}
	} );

	it( 'Should have logical tabbing', async () => {
		try {
			await testForLogicalTabbing();
		} catch ( ex ) {
			if ( ex instanceof FailedTestException ) {
				// We will make a gif to help understand what went wrong
				if ( process.env.UI_DEBUG ) {
					await makeGif( 1280, 800, SCREENSHOT_TABBING_TEST, 100 );
					printMessage( 'warning', ex.messages );
				}
			} else {
				console.log( ex );
			}
		}
	} );
} );
