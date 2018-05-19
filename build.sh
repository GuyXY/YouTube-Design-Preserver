#!/bin/bash

DIST_DIR=$PWD/dist
WEBEXT_POLYFILL=$PWD/webextension-polyfill/dist/browser-polyfill.min.js

rm -rf $DIST_DIR
mkdir -p $DIST_DIR/firefox $DIST_DIR/chrome

cp -r src/. $DIST_DIR/firefox/
cp -r src/. $DIST_DIR/chrome/

# if the webextension polyfill is not yet initialized, do it now
if [ ! -e $WEBEXT_POLYFILL ]; then

	git clone https://github.com/mozilla/webextension-polyfill
	cd webextension-polyfill
	
	npm install
	npm run build

fi

cp webextension-polyfill/dist/browser-polyfill.min.js $DIST_DIR/chrome/lib/

jq -c '. + {"applications": {"gecko": {"id": "{5b7175f9-183b-4421-b105-82ef7ef426d0}"}}}' < manifest.json > $DIST_DIR/firefox/manifest.json
jq -c '.background.scripts |= ["lib/browser-polyfill.min.js"] + .' < manifest.json > $DIST_DIR/chrome/manifest.json

sed -i '/<\/head>/s|^|<script src="/lib/browser-polyfill.min.js"></script>|' $DIST_DIR/chrome/settings/settings.html

cd $DIST_DIR/firefox;   zip -r $DIST_DIR/firefox.zip *
cd $DIST_DIR/chrome;    zip -r $DIST_DIR/chrome.zip *
