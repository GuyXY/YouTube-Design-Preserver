const fs = require("fs");
const util = require("util");
const {JSDOM} = require("jsdom");

const Promisified = {
    stat: util.promisify(fs.stat),
    readFile: util.promisify(fs.readFile),
    readdir: util.promisify(fs.readdir),
    mkdir: util.promisify(fs.mkdir),
    writeFile: util.promisify(fs.writeFile)
};

//a quick and dirty deep copy function. Avoid at all cost for objects with functions or date keys
function deepCopy(object) {
    return JSON.parse(JSON.stringify(object));
}

(async function() {

    let manifest = JSON.parse(await Promisified.readFile("manifest.json"));

    let firefoxManifest = deepCopy(manifest);
    firefoxManifest.applications = {"gecko": {"id": "{5b7175f9-183b-4421-b105-82ef7ef426d0}"}};

    let chromeBasedManifest = deepCopy(manifest);
    chromeBasedManifest.background.scripts.unshift("lib/browser-polyfill.min.js");


    let settingsHtml = new JSDOM(await Promisified.readFile("settings/settings.html"));

    let browserPolyfill = settingsHtml.window.document.createElement("script");
    browserPolyfill.setAttribute("src", "/lib/browser-polyfill.min.js");

    settingsHtml.window.document.getElementsByTagName("head")[0].appendChild(browserPolyfill);

    await Promise.all([
        Promisified.writeFile("gen/firefox/manifest.json", JSON.stringify(firefoxManifest)),
        Promisified.writeFile("gen/chromeBased/manifest.json", JSON.stringify(chromeBasedManifest)),
        Promisified.writeFile("gen/chromeBased/settings/settings.html", settingsHtml.serialize())
    ]);

})();