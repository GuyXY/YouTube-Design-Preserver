let currentStatus;

const cookieName = "PREF";

const modifiers = {
	
	oldLayout: {
		orMap: new Map([["f6", 0x8]])
	},
	
	darkMode: {
		orMap: new Map([["f6", 0x400]]),
		nandMap: new Map([["f6", 0x8]])
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

browser.webRequest.onBeforeSendHeaders.addListener(details => {

	if(!currentStatus || currentStatus == "disabled") {
		return;
	}

	//get the cookie header
	let header = details.requestHeaders.find(header => header.name == "Cookie");

	//create an array of all the cookies
	let cookies = header.value.split("; ");

	//get the original PREF cookie value and remove it from the cookies array
	let origPrefValue = "";
	for(let i = 0; i < cookies.length; ++i) {
		if(cookies[i].startsWith(`${cookieName}=`)) {
			origPrefValue = cookies[i].split(/=(.*)/)[1];
			cookies.splice(i, 1);
			break;
		}
	}

	//add the patched PREF cookie to the cookies array
	cookies.push(`${cookieName}=${patchCookie(origPrefValue, modifiers[currentStatus])}`);

	//apply the adjusted cookie array
	header.value = cookies.join("; ");
	return {"requestHeaders": details.requestHeaders};
}, {
	"urls": [
		"*://youtube.com/*",
		"*://www.youtube.com/*"
	]
}, ["blocking", "requestHeaders"]);
