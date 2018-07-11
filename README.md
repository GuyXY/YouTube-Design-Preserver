![alt text](https://github.com/GuyXY/YouTube-Design-Preserver/raw/master/src/icons/icon64.png) 

YouTube Design Preserver
======
YouTube Design Preserver is a browser extension that allows you to choose between the old, dark or normal YouTube design and preserve it permanently!

Links
------
https://addons.mozilla.org/en-US/firefox/addon/youtube-design-preserver/

https://addons.opera.com/en/extensions/details/youtube-design-preserver/

Build
------
To build this project you have to have the following tools installed:
`sed jq zip nodejs npm`

Once you have installed all of these tools, you can build the project with these few steps:

```
npm install
npm run build
```

The resulting files are going be in the `dist` directory. Note that the `chrome` files will work with all chromium based browsers.

Known limitations
------
YouTube Design Preserver will not work in private browsing mode for Firefox versions older than 52.
