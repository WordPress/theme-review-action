/**
 * External dependencies
 */
const fs = require( 'fs' );

/**
 * Internal dependencies
 */
import { expect } from '../../../fixtures';
import {
	warnWithMessageOnFail,
	getTabbableElementsAsync,
	getElementPropertyAsync,
	isDebugMode,
	makeGif,
	FailedTestException,
	truncateElementHTML,
	SCREENSHOT_FOLDER_PATH,
} from '../../../../utils';

const SCREENSHOT_TABBING_TEST = `${ SCREENSHOT_FOLDER_PATH }/tabbing-test`;

/**
 * Loops through tabbable elements and test whether the active element in the dom matches our list.
 *
 * @param {import('@playwright/test').Page} page
 */
const runTest = async ( page ) => {
	/*
	 * Hide these so tabbing doesn't descend into their controls; display:none
	 * also takes them out of the tab flow.
	 */
	await page.addStyleTag( {
		content: 'audio, video, iframe { display: none !important; }',
	} );

	let tabElements = await getTabbableElementsAsync( page );

	/* Issues past 50 elements deep aren't very concerning, and stopping there speeds up the test. */
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
		await page.waitForTimeout( 100 );
	}

	return true;
};

export default async ( page ) => {
	try {
		return await runTest( page );
	} catch ( ex ) {
		if ( ex instanceof FailedTestException ) {
			if ( process.env.UI_DEBUG ) {
				await makeGif( 1280, 800, SCREENSHOT_TABBING_TEST, 100 );
			}

			warnWithMessageOnFail(
				ex.messages,
				'should-have-logical-tabbing',
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
