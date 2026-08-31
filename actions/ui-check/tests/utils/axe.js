import AxeBuilder from '@axe-core/playwright';

/**
 * Runs axe against the page for the given tags, excluding selectors.
 *
 * @param {import('@playwright/test').Page} page Playwright page.
 * @param {{tags: string[], exclude: string[]}} options Axe tags and selectors to skip.
 * @return {Promise<object>} Axe results, including a `violations` array.
 */
export const runAxe = async ( page, { tags, exclude } ) => {
	let builder = new AxeBuilder( { page } ).withTags( tags );

	for ( const selector of exclude ) {
		builder = builder.exclude( selector );
	}

	return builder.analyze();
};
