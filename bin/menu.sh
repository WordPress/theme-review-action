
#!/bin/sh

MENU_ID=$( npm run wp-env run tests-cli "wp menu location list --format=csv | tail -n +2 | head -n 1 | cut -d, -f1" )
CLEANED=$(echo $MENU_ID | grep -oE '[^ ]+$')

npm run wp-env run tests-cli "wp menu location assign 'All Pages' $CLEANED"
 


