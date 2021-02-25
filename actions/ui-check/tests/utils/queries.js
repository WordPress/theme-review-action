/**
 * Retrieves list elements that are focusable by keyboard from the DOM
 * @return {array} List of focusable element
 */
const queryForFocusableElementsAsync = async () => {
	return await page.$$(
		'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
	);
};

/**
 * Returns whether the element is visible
 * @param {Puppeteer|ElementHandle} element
 * @return {boolean} List of focusable element
 */
export const elementIsVisibleAsync = async ( element ) => {
	// If the bounding box is null,
	// Caveat: This will not work for children on a hidden element
	let isVisible = ( await element.boundingBox() ) !== null;
	if ( ! isVisible ) {
		return false;
	}

	// If it's true, let's check to make sure the parent is not hidden.
	const hasHiddenParent = await page.evaluate( ( e ) => {
		function elementIsHidden( currentElement ) {
			const computedStyle = getComputedStyle( currentElement );
			if (
				computedStyle.display.toLowerCase() === 'none' ||
				computedStyle.visibility.toLowerCase() === 'hidden'
			) {
				return true;
			}

			if (
				currentElement.offsetParent !== null &&
				currentElement.tagName.toLowerCase() !== 'body'
			) {
				elementIsHidden( currentElement.offsetParent );
			}

			return false;
		}

		return elementIsHidden( e );
	}, element );

	return ! hasHiddenParent;
};

/**
 * Return property for element
 * @param {Puppeteer|ElementHandle} element
 * @param {string} property name of the html property
 */
export const getElementPropertyAsync = async ( element, property ) => {
	return await ( await element.getProperty( property ) ).jsonValue();
};

/**
 * Returns a fairly random sample of links
 * @param {array} arr Array of elements
 * @param {number} max Number of items to return
 * @return {array} List of elements
 */
const getRandomList = ( arr, max ) => {
	const newArr = [];

	if ( arr.length < max ) {
		return arr;
	}

	for ( var i = 0; i < max; i++ ) {
		var rand = arr[ Math.floor( Math.random() * arr.length ) ];
		newArr.push( rand );
	}
	return newArr;
};

/**
 * Retrieves list elements that are focusable by keyboard from the DOM excluding hidden & disabled elements.
 * @return {Puppeteer|ElementHandle[]} List of focusable element
 */
export const getFocusableElementsAsync = async () => {
	let elements = await queryForFocusableElementsAsync();
	const final = [];
	const pathMap = {};

	elements = getRandomList( elements, 30 );

	for ( let i = 0; i < elements.length; i++ ) {
		// Check if it disabled
		const elementProperties = await page.evaluate( ( e ) => {
			/**
			 * Recurses upwards and returns a list of tag names
			 * @param {array} parts List of xPath parts
			 * @param {HtmlElement} element
			 * @param {number} levelsRemaining Number of times to recurse (Essentially, how many parents do we want..)
			 */
			const getLazyXPath = ( parts, element, levelsRemaining ) => {
				if ( levelsRemaining < 1 || ! element.parentElement ) {
					return parts;
				} else {
					getLazyXPath(
						parts,
						element.parentElement,
						levelsRemaining - 1
					);
				}

				parts.push( element.tagName );

				return parts;
			};

			return {
				tag: e.tagName,
				href: e.href,
				disabled: e.disabled,
				class: e.className,
				lazyXPath: getLazyXPath( [], e, 5 ).join( '>' ),
			};
		}, elements[ i ] );

		if ( elementProperties.disabled ) {
			continue;
		}

		// Anchor tags without hrefs will not focus
		if (
			elementProperties.tag.toLowerCase() === 'a' &&
			! elementProperties.href.length
		) {
			continue;
		}

		if ( ! ( await elementIsVisibleAsync( elements[ i ] ) ) ) {
			continue;
		}

		// We track wether we already have a similar element
		// We don't want to test the same elements since it takes times
		if ( ! pathMap[ elementProperties.lazyXPath ] ) {
			final.push( elements[ i ] );
		}

		pathMap[ elementProperties.lazyXPath ] = true;
	}

	return final;
};

/**
 * Retrieves list elements that are tabbing by keyboard.
 * @return {Puppeteer|ElementHandle[]} List of tabbable element
 */
export const getTabbableElementsAsync = async () => {
	const elements = await queryForFocusableElementsAsync();
	const final = [];

	for ( let i = 0; i < elements.length; i++ ) {
		const element = await page.evaluate( ( el ) => {
			/**
			 * Returns whether element is visible
			 * @param {HTMLelement} element
			 * @returns {boolean}
			 */
			const isVisible = ( element ) => {
				const rect = element.getBoundingClientRect();
				return ! (
					rect.x <= 0 ||
					rect.y - window.innerHeight >= 0 ||
					( rect.width === 0 && rect.height === 0 )
				);
			};

			/**
			 * Crawls upward looking for the outermost <ul> element
			 * @param {HTMLElement} element
			 * @returns {HTMLElement}
			 */
			const getOutermostUl = ( element ) => {
				var parent = element.parentElement.closest( 'ul' );

				if ( parent === null ) {
					return element;
				}

				return getOutermostUl( parent );
			};

			// Is it most likely a nav item?
			const parentUL = getOutermostUl( el );

			// We check parent visibility to exclude hidden nav items (ie: mobile nav that replicate the main nav)
			const hasVisibleULParent = isVisible( parentUL );

			return {
				tagName: el.tagName,
				disabled: el.disabled,
				href: el.href,
				innerText: el.innerText,
				isLikelyNavItem: parentUL !== el && hasVisibleULParent,
				isButtonInsideOfLi:
					el.tagName.toLowerCase() === 'button' &&
					el.parentElement.tagName.toLowerCase() === 'li',
			};
		}, elements[ i ] );

		// Disabled elements will not get tabbing focus
		if ( element.disabled ) {
			continue;
		}

		// Links without hrefs will not get tabbing focus
		if ( element.tagName.toLowerCase() === 'a' && ! element.href ) {
			continue;
		}

		// Only include hidden elements if they are most likely part of navigation
		if (
			! ( await elementIsVisibleAsync( elements[ i ] ) ) &&
			! element.isLikelyNavItem
		) {
			continue;
		}

		// Themes use buttons for dropdowns in navigational items that don't get focus because of javascript.
		if ( element.isButtonInsideOfLi ) {
			continue;
		}

		final.push( elements[ i ] );
	}

	return final;
};
