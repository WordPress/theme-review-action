/**
 * Internal dependencies
 */
import { goTo } from '../../../utils';

import skipLinksTest from './skip-links';
import subMenuTest from './sub-menu';
import elementFocusTest from './element-focus';
import tabbingTest from './tabbing';

describe( '/', () => {
	beforeAll( async () => {
		await goTo( '/' );
	} );

	it( 'Should have skip links', async () => {
		await skipLinksTest();
	} );

	it( 'Should have appropriate submenus', async () => {
		await subMenuTest();
	} );

	it( 'Should have element focus state', async () => {
		await elementFocusTest();
	} );

	it( 'Should have logical tabbing', async () => {
		await tabbingTest();
	} );
} );
