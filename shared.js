const URL = "https://youtube.com";
const PREF_COOKIE_NAME = "PREF";
const VISITOR_COOKIE_NAME = "VISITOR_INFO1_LIVE";

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

let cookieInfo = {
	"name": PREF_COOKIE_NAME,
	"url": URL
};

function defaultErrorHandler(errorMessage) {
    console.trace(errorMessage);
}

async function patcher(cookieValue) {

	//move the PREF cookie into a map object
	let map = new Map();
	if(cookieValue) {
		for(let param of cookieValue.split("&")) {
			let paramPart = param.split("=");
			map.set(paramPart[0], paramPart[1]);
		}
	}

	let {status} = await (await getStorage()).get("status");

	switch(status) {
		case "oldLayout":
			map.set("f6", 8);
			break;
		case "darkMode":
			map.set("f6", 400);
			break;
		case "normalMode":
			map.delete("f6");
	}
	
	//transform the map into an array of "key=value" strings
	let paramArray = [];
	for(let param of map) {
		paramArray.push(`${param[0]}=${param[1]}`);
	}

	//join the array back to a single string with "&" characters
	return paramArray.join("&");
}

function setPrefCookies() {
	setCookies(cookieInfo, ".youtube.com", patcher);
}