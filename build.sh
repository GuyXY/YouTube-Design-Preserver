#!/bin/bash

# make sure that the script exits as soon as an error occurs
set -e

# Variables
DIST_DIR=$PWD/dist
WEBEXT_POLYFILL=$PWD/webextension-polyfill/dist/browser-polyfill.min.js

# cleanup dist directory and recreate the needed directories
rm -rf $DIST_DIR
mkdir -p $DIST_DIR/firefox $DIST_DIR/chrome

# copy the source files into the firefox and chrome dist folders
cp -r src/. $DIST_DIR/firefox/
cp -r src/. $DIST_DIR/chrome/

# if the webextension polyfill is not yet initialized, do it now
if [ ! -e $WEBEXT_POLYFILL ]; then

	git clone https://github.com/mozilla/webextension-polyfill
	cd webextension-polyfill
	
	npm install
	npm run build
	
	cd ..

fi

# add the webextension polyfill for all chromium based browsers
cp webextension-polyfill/dist/browser-polyfill.min.js $DIST_DIR/chrome/lib/

# patch the manifest files accordingly
jq -c '. + {"applications": {"gecko": {"id": "{5b7175f9-183b-4421-b105-82ef7ef426d0}"}}}' < manifest.json > $DIST_DIR/firefox/manifest.json
jq -c '.background.scripts |= ["lib/browser-polyfill.min.js"] + .' < manifest.json > $DIST_DIR/chrome/manifest.json

# add an include for the webextension polyfill to the settings html file
sed -i '/<\/head>/s|^|<script src="/lib/browser-polyfill.min.js"></script>|' $DIST_DIR/chrome/settings/settings.html

# create the final zip files for every browser
cd $DIST_DIR/firefox;   zip -r $DIST_DIR/firefox.zip *
cd $DIST_DIR/chrome;    zip -r $DIST_DIR/chrome.zip *
