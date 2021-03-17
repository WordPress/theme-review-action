


# UI Errors Documentation

## Table of Contents

- [Page should contain body class](#page-should-contain-body-class)
- [Page should not have PHP errors](#page-should-not-have-php-errors)
- [Page should return 200 status](#page-should-return-200-status)
- [Browser console should not contain errors](#browser-console-should-not-contain-errors)
- [Page should have complete output](#page-should-have-complete-output)
- [Page should not have unexpected links](#page-should-not-have-unexpected-links)
- [Should have skip links](#should-have-skip-links)
- [Should have appropriate submenus](#should-have-appropriate-submenus)
- [Should have element focus state](#should-have-element-focus-state)
- [Should have logical tabbing](#should-have-logical-tabbing)

## Page should contain body class 

This test expects the page's body class to be present on the page.

[WordPress.org rule definition.](https://make.wordpress.org/themes/handbook/review/required/#templates)

### Troubleshooting 

Make sure all your relevant templates include something like the following: 

```
<body <?php body_class(); ?>>
```

[Read more](https://developer.wordpress.org/reference/functions/body_class/)

## Page should not have PHP errors

This test expects that the plugin does not output any PHP errors.

[WordPress.org rule definition.](https://make.wordpress.org/themes/handbook/review/required/#code)

### Troubleshooting 

Verify that the page does not display any PHP errors.

## Page should return 200 status

This test expects that pages return a `200` http status code when visiting in the browser.

### Troubleshooting 

Make sure your plugin does not have any unnecessary redirects.

## Browser console should not contain errors

This test expects that the plugin doesn't not output anything to the browser console.

[WordPress.org rule definition.](https://make.wordpress.org/themes/handbook/review/required/#code)

### Troubleshooting 

Open your Browser Developer tools:
- Verify that all assets (images, JavaScript, css, etc..) are loaded properly.
- Verify that JavaScript errors are not present

## Page should have complete output

This test expects that pages have proper HTML code.

### Troubleshooting 

Verify that pages have both opening and closing tags. Focus on the following elements:

- `<html>`
- `<head>`
- `<body>`
- `<rss>` - If necessary

You can also use the [Markup Validation Service](https://validator.w3.org/) to help.

## Page should not have unexpected links

Verify that pages do not include promotional links or unexpected links to third-party web sites. Footer credit links to the theme or author site are permitted.

[WordPress.org rule definition.](https://make.wordpress.org/themes/handbook/review/required/#selling-credits-and-links)

### Troubleshooting 

Verify that the theme only includes links in the [hosts List](https://github.com/WordPress/theme-review-action/blob/f97655ebfbd5602686b62491dda36f0de4a60bd7/actions/ui-check/tests/e2e/specs/page/index.test.js#L114).

## Should have skip links

This test expects that pages include skip links for accessibility.

[WordPress.org rule definition.](https://make.wordpress.org/themes/handbook/review/required/#skip-links)

### Troubleshooting 

Verify that on pages that include content, the first time user types the `Tab` key, a skip link is present.

[Read more](https://make.wordpress.org/themes/handbook/review/accessibility/required/#skip-links)

## Should have appropriate submenus

This test expects that navigational menus are useable using a keyboard.

[WordPress.org rule definition.](https://make.wordpress.org/themes/handbook/review/accessibility/required/#keyboard-navigation)

### Troubleshooting 

Verify that you can use the `Tab` keyboard button to access and enter all items in the page's menu.

## Should have element focus state

This test expects that all focusable element have a visible focus state.

### Troubleshooting 

- `Tab` through the tab and verify that all focusable elements have a visible difference when in focus.
- Hover over focusable elements and verify they have visible difference.

[Read more](https://make.wordpress.org/themes/handbook/review/accessibility/required/#contrasts)

## Should have logical tabbing

This test expects tabbing to move logically through the page.

### Troubleshooting 

- Tab through the page and verify that focus moves through the page visibly and as expected.
