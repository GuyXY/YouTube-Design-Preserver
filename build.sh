#!/bin/bash

# make sure that the script exits as soon as an error occurs
set -e

# Variables
DIST_DIR=$PWD/dist

# reset dist and tmp directories
rm -rf $DIST_DIR tmp
mkdir -p $DIST_DIR

# copy src directory into tmp and add lib files
cp -r src tmp
mkdir -p tmp/lib
cp node_modules/webext-common.js/common.js tmp/lib/
cp node_modules/webext-cookie.js/cookie.js tmp/lib/

# copy tmp into the firefox and chrome dist directories
cp -r tmp $DIST_DIR/firefox
cp -r tmp $DIST_DIR/chrome

# add the webextension polyfill for all chromium based browsers
cp node_modules/webextension-polyfill/dist/browser-polyfill.min.js $DIST_DIR/chrome/lib/

# patch the manifest files accordingly
jq -c '. + {"applications": {"gecko": {"id": "{5b7175f9-183b-4421-b105-82ef7ef426d0}"}}}' < manifest.json > $DIST_DIR/firefox/manifest.json
jq -c '.background.scripts |= ["lib/browser-polyfill.min.js"] + .' < manifest.json > $DIST_DIR/chrome/manifest.json

# add an include for the webextension polyfill to the settings html file
sed -i '/<\/head>/s|^|<script src="/lib/browser-polyfill.min.js"></script>|' $DIST_DIR/chrome/settings/settings.html

# create the final zip files for every browser
cd $DIST_DIR/firefox;   zip -r $DIST_DIR/firefox.zip *
cd $DIST_DIR/chrome;    zip -r $DIST_DIR/chrome.zip *
