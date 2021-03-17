


# UI Warnings Documentation

## Table of Contents

- [Should have skip links](#should-have-skip-links)
- [Should have appropriate submenus](#should-have-appropriate-submenus)
- [Should have element focus state](#should-have-element-focus-state)
- [Should have logical tabbing](#should-have-logical-tabbing)

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