const MAX_DATE = 8640000000000;

//cookie has to contain a valid url key
async function setCookie(cookie, patcher, forceSet) {

	delete cookie.hostOnly;
	delete cookie.session;
	
	cookie.expirationDate = MAX_DATE;

	let patchedValue = await patcher(cookie.value);
	if(forceSet || cookie.value != patchedValue) {
		cookie.value = patchedValue;
		browser.cookies.set(cookie);
		console.log(`updated ${cookie.name} cookie to ${JSON.stringify(cookie)}`);
	}
    
}

//cookieInfo has to contain the following keys: name, url
async function setCookies(cookieInfo, domain, patcher) {
    for(let cookieStore of await browser.cookies.getAllCookieStores()) {

        cookieInfo.storeId = cookieStore.storeId;

        let cookie = await browser.cookies.get(cookieInfo);
        
        //if the cookie doesn't exist, create it!
        if(!cookie) {
            cookie = Object.assign({}, cookieInfo);
            cookie.domain = domain;
        }
    
        setCookie(cookie, patcher);
    }
}

//cookieInfo has to contain the following keys: name, url
function setAutoCookiePatcher(cookieInfo, patcher) {
    browser.cookies.onChanged.addListener(changedInfo => {
        let {cookie} = changedInfo;

        cookie.url = cookieInfo.url;
    
        if(cookie.name == cookieInfo.name && changedInfo.cause != "overwrite") {
            setCookie(cookie, patcher, changedInfo.removed);
        }
    });
}