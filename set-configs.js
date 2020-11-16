const Utils = require('./utils')

const init = () => {
    if( Utils.getParentTheme() ) {
        console.log('::set-output name=theme-type::child');

    } else if( Utils.isBlockBasedTheme() ) {
        console.log('::set-output name=theme-type::block');

    } else {
        console.log('::set-output name=theme-type::default');
    }
}

const setUIScreenshotPath = () => {
    console.log(`::set-output name=location::${process.env.GITHUB_ACTION_PATH}/actions/ui-check/screenshots`);
}

setThemeType();
setUIScreenshotPath();
