let cookieName = 'PREF';
let orMap = new Map([
	['f1', 0x50000000],
	['f6', 0x8],
	['f5', 0x30]
]);

function patchCookie(cookieValue) {

	//move the PREF cookie into a map object
	let map = new Map();
	if(cookieValue != '') {
		for(let param of cookieValue.split('&')) {
			let paramPart = param.split('=');
			map.set(paramPart[0], parseInt(paramPart[1], 16));
		}
	}

	//patch the values that need patching
	for(let key of orMap.keys()) {
		map.set(key, map.get(key) | orMap.get(key));
	}
	
	//transform the map into an array of "key=value" strings
	let paramArray = [];
	for(let param of map) {
		paramArray.push(`${param[0]}=${param[1].toString(16)}`);
	}

	//join the array back to a single string with "&" characters
	return paramArray.join('&');
}

browser.webRequest.onBeforeSendHeaders.addListener(details => {

	//get the cookie header
	let header = details.requestHeaders.find(header => header.name == 'Cookie');

	//create an array of all the cookies
	let cookies = header.value.split('; ');

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
	cookies.push(`${cookieName}=${patchCookie(origPrefValue)}`);

	//apply the adjusted cookie array
	header.value = cookies.join('; ');
	return {"requestHeaders": details.requestHeaders};
}, {
	"urls": [
		"*://youtube.com/*",
		"*://www.youtube.com/*"
	]
}, ['blocking', 'requestHeaders']);
