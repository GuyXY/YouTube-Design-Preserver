const URL = "https://youtube.com";
const PREF_COOKIE_NAME = "PREF";
const VISITOR_COOKIE_NAME = "VISITOR_INFO1_LIVE";
const MAX_DATE = 8640000000000;

function isDisabled(status) {
    return !status || status == "disabled";
}

function defaultErrorHandler(errorMessage) {
    console.trace(errorMessage);
}

function patchCookie(cookieValue, status) {

	//move the PREF cookie into a map object
	let map = new Map();
	if(cookieValue) {
		for(let param of cookieValue.split("&")) {
			let paramPart = param.split("=");
			map.set(paramPart[0], paramPart[1]);
		}
	}

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

function setPrefCookie(cookie, status, forceSet) {

	if(isDisabled(status)) return;
	
	delete cookie.hostOnly;
	delete cookie.session;
	
	cookie.url = URL;
	cookie.expirationDate = MAX_DATE;

	const patchedValue = patchCookie(cookie.value, status);
	if(forceSet || cookie.value != patchedValue) {
		cookie.value = patchedValue;
		browser.cookies.set(cookie).then(() => {
			console.log(`updated ${cookie.name} cookie to ${status} (${JSON.stringify(cookie)})`);
		}, defaultErrorHandler);
	}
    
}

function createCookieInfo(details) {

	for(let property of Object.keys(details)) {
		if(["url", "name", "storeId"].indexOf(property) == -1) {
			delete details[property];
		}
	}

	if(!details.url) {
		details.url = URL;
	}

	return details;
}

function setPrefCookies(status) {
	browser.cookies.getAllCookieStores().then(cookieStores => {

		for(let cookieStore of cookieStores) {

			let cookieInfo = createCookieInfo({
				"name": PREF_COOKIE_NAME,
				"storeId": cookieStore.id
			});

			browser.cookies.get(cookieInfo).then(cookie => {
				
				//if the PREF cookie doesn't exist yet, create it!
				if(!cookie) {
					cookie = cookieInfo;
					cookie.domain = ".youtube.com"
				}
			
				setPrefCookie(cookie, status);
			}, defaultErrorHandler);
		}
	}, defaultErrorHandler);
}