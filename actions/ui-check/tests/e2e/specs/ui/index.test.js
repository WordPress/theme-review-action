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
	warnWithMessageOnFail,
	meetsChangeThreshold,
	getPercentOfOpaqueness,
	getFocusableElementsAsync,
	truncateElementHTML,
	getTabbableElementsAsync,
	getElementPropertyAsync,
	isDebugMode,
	makeGif,
} from '../../../utils';

const SCREENSHOT_FOLDER_PATH = 'screenshots';
const SCREENSHOT_FOCUS_TEST = `${ SCREENSHOT_FOLDER_PATH }/focus-test`;
const SCREENSHOT_TABBING_TEST = `${ SCREENSHOT_FOLDER_PATH }/tabbing-test`;

import skipLinksTest from './skip-links';
import subMenuTest from './sub-menu';

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
				`The element "${ truncateElementHTML(
					domElement,
					300
				) }" does not have enough visible difference when focused. `,
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
				'Tabbing is not working as expected',
				`Expected: ${ truncateElementHTML( expectedElement, 300 ) }`,
				`Current: ${ truncateElementHTML( currentFocus, 300 ) }`,
			] );
		}

		// If we don't wait at least 100ms, the test can get out of sync
		await new Promise( ( resolve ) => setTimeout( resolve, 100 ) );
	}
};

describe( 'Accessibility: UI', () => {
	it( 'Should have skip links', async () => {
		await page.goto( createURL( '/' ) );
		await skipLinksTest();
	} );

	it( 'Should have appropriate submenus', async () => {
		await page.goto( createURL( '/' ) );
		await subMenuTest();
	} );

	it.skip( 'Should have element focus state', async () => {
		try {
			await testElementFocusState();
		} catch ( ex ) {
			if ( ex instanceof FailedTestException ) {
				warnWithMessageOnFail(
					ex.messages,
					'should-have-element-focus-state',
					() => {
						expect( false ).toEqual( true );
					}
				);
			} else {
				console.log( ex );
			}
		}
	} );

	it.skip( 'Should have logical tabbing', async () => {
		try {
			await testForLogicalTabbing();
		} catch ( ex ) {
			if ( ex instanceof FailedTestException ) {
				// We will make a gif to help understand what went wrong
				if ( process.env.UI_DEBUG ) {
					await makeGif( 1280, 800, SCREENSHOT_TABBING_TEST, 100 );
					warnWithMessageOnFail(
						ex.messages,
						'should-have-logical-tabbing',
						() => {
							expect( false ).toEqual( true );
						}
					);
				}
			} else {
				console.log( ex );
			}
		}
	} );
} );
