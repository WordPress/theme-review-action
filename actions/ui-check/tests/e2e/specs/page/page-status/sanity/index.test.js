import path from 'path';

/**
 * Internal dependencies
 */
import test from '../index.js';

describe( 'Sanity: Page Status', () => {
	it( 'Page should PASS when it returns a 200', async () => {
		expect( await test( '/', 200 ) ).toBeTruthy();
	} );

	it( 'Page should FAIL when it returns not a 200', async () => {
		expect( await test( '/', 400 ) ).toBeFalsy();
		expect( await test( '/', 404 ) ).toBeFalsy();
		expect( await test( '/', 500 ) ).toBeFalsy();
	} );
} );
