/**
 * Internal dependencies
 */
import { createURL } from '../../../utils';

import skipLinksTest from './skip-links';
import subMenuTest from './sub-menu';
import elementFocusTest from './element-focus';
import tabbingTest from './tabbing';

describe( 'Accessibility: UI', () => {
	it( 'Should have skip links', async () => {
		await page.goto( createURL( '/' ) );
		await skipLinksTest();
	} );

	it( 'Should have appropriate submenus', async () => {
		await page.goto( createURL( '/' ) );
		await subMenuTest();
	} );

	it( 'Should have element focus state', async () => {
		await page.goto( createURL( '/' ) );
		await elementFocusTest();
	} );

	it( 'Should have logical tabbing', async () => {
		await page.goto( createURL( '/' ) );
		await tabbingTest();
	} );
} );
