/**
 * Internal dependencies
 */
import { test } from '../../fixtures';

import skipLinksTest from './skip-links';
import subMenuTest from './sub-menu';
import elementFocusTest from './element-focus';
import tabbingTest from './tabbing';

test.describe( 'Accessibility: UI', () => {
	test( 'Should have skip links', async ( { page, goTo } ) => {
		await goTo( '/' );
		await skipLinksTest( page );
	} );

	test( 'Should have appropriate submenus', async ( { page, goTo } ) => {
		await goTo( '/' );
		await subMenuTest( page );
	} );

	test( 'Should have element focus state', async ( { page, goTo } ) => {
		await goTo( '/' );
		await elementFocusTest( page );
	} );

	test( 'Should have logical tabbing', async ( { page, goTo } ) => {
		await goTo( '/' );
		await tabbingTest( page );
	} );
} );
