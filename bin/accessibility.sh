
#!/bin/bash

npm run wp-env run tests-cli 'plugin install wordpress-importer --activate'
npm run wp-env run tests-cli 'import config/a11y-theme-unit-test-data.xml --authors=create --quiet'