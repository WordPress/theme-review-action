/**
 * External dependencies
 */
import { parse } from '@wordpress/block-serialization-spec-parser';

/**
 * Internal dependencies
 */
import { warnWithMessageOnFail } from '../../utils';

/**
 * Returns whether an empty space has been parsed as a block.
 *
 * The parser will return a block for 1 empty space.
 * Looks like: {"attrs": {}, "blockName": null, "innerBlocks": [], "innerContent": ["·"], "innerHTML": "·"}
 * We don't want this object to throw an error and fail the test.
 *
 * @param {array} innerContent the parse inner content
 * @returns {bool} Whether it's an empty space that was capture
 */
const emptyInnerContentFeature = ( innerContent ) => {
	return innerContent.length === 1 && innerContent[ 0 ].trim().length < 1;
};

export default ( templates ) => {
	const failures = [];

	for ( let i = 0; i < templates.length; i++ ) {
		const blocks = parse( templates[ i ].contents );

		for ( let j = 0; j < blocks.length; j++ ) {
			const block = blocks[ j ];

			if (
				block.blockName === null &&
				! emptyInnerContentFeature( block.innerContent )
			) {
				failures.push(
					`There's a problem with ${ templates[ i ].fileName }.`,
					`Contents: ${ templates[ i ].contents }`,
					' '
				); // spacer
			}
		}
	}

	return warnWithMessageOnFail(
		failures,
		'should-have-complete-templates',
		() => {
			expect( failures ).toHaveLength( 0 );
		}
	);
};
