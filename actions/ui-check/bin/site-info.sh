#!/bin/bash

# Set a default in case it's ran locally
TEST_PORT=${WP_ENV_TESTS_PORT:=8889}

curl "http://localhost:$TEST_PORT/?rest_route=/theme-test-helper/v1/info" > tests/e2e/specs/page/siteinfo.json
