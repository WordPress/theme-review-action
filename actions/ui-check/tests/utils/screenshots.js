const GIFEncoder = require( 'gif-encoder' );
const fs = require( 'fs' );
const util = require( 'util' );
const getPixels = require( 'get-pixels' );

/**
 * Returns the percentage of pixels that are opaque in a png with transparency
 * @param {array} imageData Representation of the png
 * @return {number} Number between 0 - 100 representing the percentage of opaque pixels within the transparent png
 */
export const getPercentOfOpaqueness = ( imageData ) => {
	let i;
	let opaquePixels = 0;

	// Pixels are represented in groups of four. Ie: rgba(255,0,0,0)
	// We check the 4th item for transparency
	for ( i = 3; i < imageData.length; i += 4 ) {
		if ( imageData[ i ] === 255 ) {
			opaquePixels++;
		}
	}

	const totalPixels = imageData.length / 4;
	return ( opaquePixels / totalPixels ) * 100;
};

/**
 *  Returns whether the percentage of change is great enough
 * @param {number} changePercent
 */
export const meetsChangeThreshold = ( changePercent ) => {
	return changePercent > 0;
};

/**
 *  Creates a gif out of jpegs
 * @param {number} width
 * @param {number} height
 * @param {string} folder where the images are location
 */
export const makeGif = async ( width, height, folder, limitOverride ) => {
	const gif = new GIFEncoder( width, height );
	const limit = limitOverride || 20;

	// // Collect output
	var file = fs.createWriteStream( `${ folder }/screenshots-in-order.gif` );
	gif.pipe( file );
	gif.setQuality( 40 );
	gif.setFrameRate( 60 );
	gif.setDelay( 500 );

	// // Write out the image into memory
	gif.writeHeader();

	let jpegs = fs
		.readdirSync( folder )
		.sort( ( a, b ) => parseInt( a ) - parseInt( b ) );

	if ( jpegs.length < 1 ) {
		return;
	}

	// let's limit the number of images to keep hte gif small
	const jpegsToAddToGif = jpegs.slice( Math.max( jpegs.length - limit, 1 ) );

	const getPixelsSync = util.promisify( getPixels );

	const getPix = async ( file ) => {
		try {
			const pixels = await getPixelsSync( `${ folder }/${ file }` );
			return pixels.data;
		} catch ( ex ) {
			return null;
		}
	};

	for ( var i = 0; i < jpegsToAddToGif.length; i++ ) {
		const data = await getPix( jpegsToAddToGif[ i ] );

		if ( data !== null ) {
			gif.addFrame( data );
			gif.read();
		}
	}

	gif.finish();
};
