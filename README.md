# WordPress Theme Check Action

This code action runs various test suites to help WordPress theme development. 

## Requirements

-   NodeJs
-   NPM
-   Docker

## Action Inputs

| Input              | Type    | Description                                                            |
| ------------------ | ------- | ---------------------------------------------------------------------- |
| `root-folder`      | string  | Location of your theme's root folder                                   |
| `accessible-ready` | boolean | Whether we should run the additional accessibility tests               |
| `ui-debug`         | boolean | Setting this to true will save some screenshot artifacts for debugging |

## Triggers 

1. NPX
2. GitHub Actions
3. Using this project locally

### Running via `NPX`
You can run this project VIA npx by doing the following:

1. Inside of your WordPress theme folder, run `npx wordpress-theme-check-action`.

_Results of the tests will be printed to the console._

### Running via `GitHub Actions`
You can run this project on GitHub. Here is an example GitHub action workflow file:

```
name: Test My Theme 

on:
  push:
    branches: [ main ] ## Change the branch name to match yours
  pull_request:
    branches: [ main ] ## Change the branch name to match yours


jobs:
  run_tests:
    runs-on: ubuntu-latest

    steps:
    
    ## We need to keep this around until Gutenberg 9.6 is launched.
    - uses: actions/setup-node@v1
      with:
        node-version: '12'  

    - name: Theme Test
      id: test
      uses: Wordpress/theme-review-action@trunk
      with:
        accessible-ready: true 
        ui-debug: true

    - uses: actions/upload-artifact@v2
      if: ${{ always() }}
      with:
        name: Screenshots

```

The following working should run the tests on commits and pull requests to the `main` branch. Errors will be printed as annotations within the action runs. 

Read more about [GitHub Actions](https://docs.github.com/en/free-pro-team@latest/actions).

### Running this locally

1. Run `git clone git@github.com:WordPress/theme-review-action.git && cd theme-review-action`. 
2. Run `npm install` to install dependencies
3. Add `"DEV_MODE": true` to the `config` property in the `.wp-env.json`.
4. Move your theme into the `/test-theme` folder. Ensure that `/test-theme` is the root folder.
5. With Docker online, run `npm run install:environment`.
6. Verify that your environment is up and running and your theme installed correctly by visiting [https://localhost:8889](https://localhost:8889).

#### Notes:

- For best results on Windows, run the project using the Bash shell (or other shells that support Linux/Unix commands) as opposed to the Command Prompt.

## Supported Environments
This project currently only supports macOs and Linux operating systems.

## Checks

### `npm run check:structure`

This check runs `phpunit` unit tests to determine that all the necessary files are included in the theme. 

### `npm run check:theme-check`

This check runs the [Theme Check](https://wordpress.org/plugins/theme-check/) plugin on the theme. 

### `npm run check:ui`

This check runs various checks on the theme.

*Important*: If running locally, run using `WP_ENV_TESTS_PORT=8889 npm run check:ui`. This environment variable is set when running as a GitHub action or NPX.
