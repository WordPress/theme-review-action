#!/bin/sh

curl "http://localhost:$WP_ENV_TESTS_PORT/?rest_route=/theme-test-helper/v1/info" > tests/e2e/specs/page/siteinfo.json
