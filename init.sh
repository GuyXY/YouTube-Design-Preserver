#!/bin/bash
npm install jsdom

git clone https://github.com/mozilla/webextension-polyfill
cd webextension-polyfill

npm install
npm run build