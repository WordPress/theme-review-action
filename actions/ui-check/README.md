## WordPress Theme UI Check

This action determines whether the theme follows various UI standards.

## Requirements

- Running WordPress environment
- Node/NPM 

## Adding a new test

The test runners will run all tests that follow this format `/{*}.test.js`.

We can also run conditional tests for different themes types. The test runners attempt to find `/{*}.{THEME_TYPE}.test.js` tests if `THEME_TYPE` is set. So for example, if you want to test block based themes, you can create a file called `/navigation.block.test.js` which will only run if `THEME_TYPE=block` is set as an environment variable.
