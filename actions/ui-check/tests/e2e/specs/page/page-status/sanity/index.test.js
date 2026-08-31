/**
 * Internal dependencies
 */
import { test, expect } from '../../../../fixtures';
import checkFn from '../index.js';

test.describe( 'Sanity: Page Status', () => {
	test( 'Page should PASS when it returns a 200', async () => {
		expect( await checkFn( '/', 200 ) ).toBeTruthy();
	} );

	test( 'Page should FAIL when it returns not a 200', async () => {
		expect( await checkFn( '/', 400 ) ).toBeFalsy();
		expect( await checkFn( '/', 404 ) ).toBeFalsy();
		expect( await checkFn( '/', 500 ) ).toBeFalsy();
	} );
} );
