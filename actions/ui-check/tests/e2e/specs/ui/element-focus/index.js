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
	warnWithMessageOnFail,
	getFocusableElementsAsync,
	FailedTestException,
	meetsChangeThreshold,
	getElementPropertyAsync,
	getPercentOfOpaqueness,
	truncateElementHTML,
	SCREENSHOT_FOLDER_PATH,
} from '../../../../utils';

const SCREENSHOT_FOCUS_TEST = `${ SCREENSHOT_FOLDER_PATH }/focus-test`;

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
const test = async () => {
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
	return true;
};

export default async () => {
	try {
		return await test();
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

		return false;
	}
};
