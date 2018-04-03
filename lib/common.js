//version 1.0.0

//stoi converts a string to an integer
function stoi(string) {
	return string|0;
}

//versionCompare is a function that compares two strings of semantic versions
//this function returns
//-1 if v1 is newer
//1 if v2 is newer
//0 if both are the same
function versionCompare(v1, v2) {

	v1 = v1.split(".");
	v2 = v2.split(".");

	for(let i = 0; i < v1.length; ++i) {

		const v1Part = stoi(v1[i]);
		const v2Part = stoi(v2[i]);

		if(v1Part < v2Part) {
			return 1;
		} else if(v1Part > v2Part) {
			return -1;
		}
	}
	return 0;
}

//returns the default storage object
//for firefox browsers that are older than version 53 that's the browser.storage.local object
//for all other browsers it's the browser.storage.sync object
async function getStorage() {
	const infoFunc = browser.runtime.getBrowserInfo;
	if(infoFunc) {
		const info = await infoFunc();
		return versionCompare(info.version, "53") == 1 ? browser.storage.local : browser.storage.sync;
	} else {
		return browser.storage.sync;
	}
}