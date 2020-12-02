/**
 * External dependencies
 */
import { createURL } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import urls from './pages';
import { cleanErrorMessage, getDefaultUrl, printMessage } from '../../../utils';

describe( 'Accessibility', () => {
	// Potentially skip these tests.
	const testAccessibility =
		process.env.TEST_ACCESSIBILITY !== undefined &&
		process.env.TEST_ACCESSIBILITY;
	const accessibilityTest = testAccessibility ? 'wcag2a' : 'best-practice';
	const noticeType = testAccessibility ? 'setFailed' : 'warning';

	test.each( urls )(
		'Should pass Axe tests on %s',
		async ( name, path, query ) => {
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
					`[ Accessibility - ${ accessibilityTest } Tests ]:`,
					`Running tests on ${ name } ${ getDefaultUrl(
						path,
						query
					) } using: \nhttps://github.com/wpaccessibility/a11y-theme-unit-test`,
					cleanErrorMessage( e.message ),
				] );
				throw Error();
			}
		}
	);
} );
