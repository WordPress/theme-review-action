/**
 * Internal dependencies
 */
import { test } from '../../fixtures';
import urls from './pages';
import {
	createURL,
	printMessage,
	getEnvironmentVariable,
} from '../../../utils';
import { runAxe } from '../../../utils/axe';

const envVar = getEnvironmentVariable( process.env.TEST_ACCESSIBILITY );
const testAccessibility = envVar === 'true';
const accessibilityTest = testAccessibility ? 'wcag2a' : 'best-practice';

// Everything is reported as a warning for now.
const noticeType = 'warnings';

/**
 * Formats axe violations into log lines.
 *
 * @param {Array} violations Axe violation objects.
 * @return {string} One line per violation.
 */
const formatViolations = ( violations ) =>
	violations
		.map( ( v ) => `${ v.id }: ${ v.help } (${ v.nodes.length })` )
		.join( '\n' );

test.describe( 'Accessibility', () => {
	for ( const [ name, path, query ] of urls ) {
		test( `Should pass ${ accessibilityTest } Axe tests on ${ name }`, async ( {
			page,
		} ) => {
			await page.goto( createURL( path, query ) );

			const { violations } = await runAxe( page, {
				tags: [ accessibilityTest ],
				exclude: [ '.entry-content' ],
			} );

			if ( violations.length ) {
				printMessage( noticeType, [
					`Running tests on ${ name } ${ path }${ query } using: \nhttps://github.com/wpaccessibility/a11y-theme-unit-test`,
					formatViolations( violations ),
				] );
			}
		} );
	}
} );
