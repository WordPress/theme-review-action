


# UI Errors Documentation

## Table of Contents

- [Page should contain body class](#page-should-contain-body-class)
- [Page should not have PHP errors](#page-should-not-have-php-errors)
- [Page should return 200 status](#page-should-return-200-status)
- [Browser console should not contain errors](#browser-console-should-not-contain-errors)
- [Page should have complete output](#page-should-have-complete-output)
- [Page should not have unexpected links](#page-should-not-have-unexpected-links)
- [Block templates should be complete](#should-have-complete-templates)

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

This test expects that the theme does not output any PHP errors.

[WordPress.org rule definition.](https://make.wordpress.org/themes/handbook/review/required/#code)

### Troubleshooting 

Verify that the page does not display any PHP errors.

## Page should return 200 status

This test expects that pages return a `200` http status code when visiting in the browser.

### Troubleshooting 

Make sure your theme does not have any unnecessary redirects.

## Browser console should not contain errors

This test expects that the theme does not output anything to the browser console.

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

This test expects to **not** find links that are not approved.

### Troubleshooting 

Verify that the theme only includes links in the [hosts list](https://github.com/WordPress/theme-review-action/blob/trunk/actions/ui-check/tests/e2e/specs/page/unexpected-links/index.js).

## Block templates should be complete

This test parses block templates and block template parts to make sure all tags have applicable closing tags and are properly formatted.

Blocks are self-containing; the opening tag and the closing tag must be in the same template.
Missing tags will cause block validation errors in the editors.

Single line blocks are closed with `/-->`:
`<!-- wp:site-title /-->`

Multiline blocks are closed with `<!-- /wp:block name -->`:

```html
<!-- wp:paragraph -->
<p>Proudly powered by <a href="https://wordpress.org/">WordPress</a>.</p>
<!-- /wp:paragraph -->
```

### Troubleshooting

Open your template file:

- Verify that all opening tags have closing tags (if applicable).
- Verify that all tags have proper syntax.
