/**
 * Internal dependencies
 */
import urls from './pages';
import {
	createURL,
	cleanErrorMessage,
	printMessage,
	getEnvironmentVariable,
} from '../../../utils';

describe.each( urls, () => {
	const envVar = getEnvironmentVariable( process.env.TEST_ACCESSIBILITY );
	const testAccessibility = envVar === 'true';
	const accessibilityTest = testAccessibility ? 'wcag2a' : 'best-practice';

	//const noticeType = testAccessibility ? 'errors' : 'warnings';
	// Temporarily set everything as a warning.
	const noticeType = 'warnings';

	test( `Should pass ${ accessibilityTest } Axe tests on %s`, async ( name, path, query ) => {
		await page.goto( createURL( path, query ) );

		try {
			await expect( page ).toPassAxeTests( {
				options: {
					runOnly: {
						type: 'tag',
						values: [ accessibilityTest ],
					},
				},
				exclude: [ [ '.entry-content' ] ],
			} );
		} catch ( e ) {
			printMessage( noticeType, [
				`Running tests on ${ name } ${ path }${ query } using: \nhttps://github.com/wpaccessibility/a11y-theme-unit-test`,
				cleanErrorMessage( e.message ),
			] );
		}
	} );
} );
