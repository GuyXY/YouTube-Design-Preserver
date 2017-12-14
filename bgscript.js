let currentStatus;

const cookieName = "PREF";

const modifiers = {
	
	oldLayout: {
		orMap: new Map([["f6", 0x8]])
	},
	
	darkMode: {
		orMap: new Map([["f6", 0x400]]),
		nandMap: new Map([["f6", 0x8]])
	},

	normalMode: {
		nandMap: new Map([["f6", 0x408]])
	}

};


function patchCookie(cookieValue, modifierPack) {

	//move the PREF cookie into a map object
	let map = new Map();
	if(cookieValue != "") {
		for(let param of cookieValue.split("&")) {
			let paramPart = param.split("=");
			map.set(paramPart[0], parseInt(paramPart[1], 16));
		}
	}

	//patch the values that need patching
	if(modifierPack.orMap) {
		for(let key of modifierPack.orMap.keys()) {
			map.set(key, map.get(key) | modifierPack.orMap.get(key));
		}
	}

	if(modifierPack.nandMap) {
		for(let key of modifierPack.nandMap.keys()) {
			map.set(key, map.get(key) & ~modifierPack.nandMap.get(key));
		}
	}
	
	//transform the map into an array of "key=value" strings
	let paramArray = [];
	for(let param of map) {
		paramArray.push(`${param[0]}=${param[1].toString(16)}`);
	}

	//remove params with zero as value and join the array back to a single string with "&" characters
	return paramArray.filter(param => !param.endsWith("=0")).join("&");
}

//init currentStatus
browser.storage.sync.get("status").then(results => {
	currentStatus = results.status;
}, defaultErrorHandler);

//register change listener to keep currentStatus up to date
browser.storage.onChanged.addListener((changes, areaName) => {
	if(changes.status) {
		currentStatus = changes.status.newValue;
	}
});


const requestFilter = {
	"urls": [
		"*://youtube.com/*",
		"*://www.youtube.com/*"
	]
};

browser.webRequest.onBeforeRequest.addListener(details => {

	if(!currentStatus || currentStatus == "disabled") {
		return;
	}

	const url = "https://youtube.com";

	browser.cookies.get({
		"url": url,
		"name": cookieName
	}).then(cookie => {

		cookie.url = url;
		cookie.value = patchCookie(cookie.value, modifiers[currentStatus]);

		delete cookie.hostOnly;
		delete cookie.session;
		
		browser.cookies.set(cookie).catch(defaultErrorHandler);
	}, defaultErrorHandler);
	
	return {};
}, requestFilter, ["blocking"]);
