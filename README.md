# WordPress Theme Check Action

This code action runs various test suites to help WordPress theme development.

## Requirements

-   NodeJs
-   NPM
-   Docker

## Triggers

1. NPX
2. GitHub Actions
3. Locally

## Running via `NPX`

Inside of your WordPress theme folder, run `npx wordpress-theme-check-action`.

**Output Location**: Console

_Windows is currently not supported._

## Running via `GitHub Actions`

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
```

### Github Action Inputs

| Input              | Type    | Description                                                            |
| ------------------ | ------- | ---------------------------------------------------------------------- |
| `root-folder`      | string  | Location of your theme's root folder                                   |
| `accessible-ready` | boolean | Whether we should run the additional accessibility tests               |
| `ui-debug`         | boolean | Setting this to true will save some screenshot artifacts for debugging |

**Output Location**: GitHub Annotations

## Locally

1. Run `git clone git@github.com:WordPress/theme-review-action.git && cd theme-review-action`.
2. Run `npm install` to install dependencies.
3. Run `npm run start`.

The tests run on files within the `/test-theme` folder.

You can pass a relative path to your theme like so: `npm run start -- --pathToTheme=../my-theme`.

To see all the options run `npm run start -- --help`.

**Output Location**: `/logs` folder. Files are replaced on each test run.
