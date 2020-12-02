/**
 * Internal dependencies
 */
import urls from './pages';
import {
	createURL,
	cleanErrorMessage,
	getDefaultUrl,
	printMessage,
} from '../../../utils';

describe( 'Accessibility', () => {
	const envVar = process.env.TEST_ACCESSIBILITY || false;
	const testAccessibility = envVar === 'true';
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
