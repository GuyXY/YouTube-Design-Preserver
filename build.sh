#!/bin/bash

DIR=$PWD
COMMON_FILES="icons lib _locales settings bgscript.js shared.js"

mkdir -p gen/firefox
mkdir -p gen/chromeBased/settings

cp -r $COMMON_FILES gen/firefox/
cp -r $COMMON_FILES gen/chromeBased/

cp webextension-polyfill/dist/browser-polyfill.min.js gen/chromeBased/lib/

node generator.js

cd $DIR/gen/firefox
zip -r $DIR/firefox.zip *
cd $DIR/gen/chromeBased
zip -r $DIR/chromeBased.zip *