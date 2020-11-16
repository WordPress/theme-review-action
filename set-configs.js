const Utils = require('./utils')

/**
 * Set's theme type to be used by downstream actions
 */
const setThemeType = () => {
    if( Utils.getParentTheme() ) {
        console.log('::set-output name=theme-type::child');

    } else if( Utils.isBlockBasedTheme() ) {
        console.log('::set-output name=theme-type::block');

    } else {
        console.log('::set-output name=theme-type::default');

    }
}

setThemeType();
