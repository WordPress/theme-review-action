# WordPress Theme Check Action

This action runs tests on a WordPress to determine if its ready for submission to WordPress.org's theme directory.

## Requirements

-   NodeJs
-   NPM
-   Docker

## Action Inputs

| Input         | Description                          |
| ------------- | ------------------------------------ |
| `root-folder` | Location of your theme's root folder |
| `accessible-ready` | Whether we should run the additional accessibility tests |

## Development

1. Run `npm install` to install dependencies
2. Add `"config": { "DEV_MODE": true }` as a config to `.wp-env.json`.
3. Run `npm run install:environment` to start WordPress

If you want to test a theme locally, add a theme to the `/test-theme`.

## Checks

### `npm run check:structure`

This check runs `phpunit` unit tests to determine that all the necessary files are included in the theme. 

### `npm run check:theme-check`

This check runs the [Theme Check](https://wordpress.org/plugins/theme-check/) plugin on the theme. 

### `npm run check:ui`

This check runs various checks on the theme. 


