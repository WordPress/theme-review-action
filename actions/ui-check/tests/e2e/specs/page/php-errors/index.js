/**
 * Internal dependencies
 */
import {
    errorWithMessageOnFail,
    getErrorFromPage,
    removeLocalPathRefs,
} from '../../../../utils';

export default async(url, text) => {
    const pageError = await getErrorFromPage(text);

    return errorWithMessageOnFail(
        `${ url } contains PHP errors: ${ removeLocalPathRefs( pageError ) }`,
        'page-should-not-have-php-errors',
        () => {
            expect(pageError).toBe(null);
        }
    );
};