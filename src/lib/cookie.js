//version 1.1.0

const MAX_DATE = 8640000000000;

//cookie has to contain a valid url key
//returns a promise that get fulfilled with the cookie that has been set or undefined if nothing changed
async function setCookie(cookie, patcher, forceSet) {

	delete cookie.hostOnly;
	delete cookie.session;
	
	cookie.expirationDate = MAX_DATE;

	let patchedValue = await patcher(cookie.value);
	if(forceSet || cookie.value != patchedValue) {
		cookie.value = patchedValue;
		cookie = await browser.cookies.set(cookie);
		console.log(`updated ${cookie.name} cookie to ${JSON.stringify(cookie)}`);
        return cookie;
    }
    
}

//cookieInfo has to contain the following keys: name, url
//returns an array of promises that get fulfilled with the cookies that have been set or undefined if nothing changed
async function setCookies(cookieInfo, domain, patcher) {

    let promises = [];

    for(let cookieStore of await browser.cookies.getAllCookieStores()) {

        cookieInfo.storeId = cookieStore.storeId;

        let cookie = await browser.cookies.get(cookieInfo);
        
        //if the cookie doesn't exist, create it!
        if(!cookie) {
            cookie = {"domain": domain};
        }

        cookie = Object.assign(cookie, cookieInfo);
    
        promises.push(setCookie(cookie, patcher));
    }

    return promises;
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

//cookieInfo has to contain the following keys: name, url
//returns an array of promises that get fulfilled with the cookies that have been deleted
async function removeCookies(cookieInfo) {

    let cookieStores = await browser.cookies.getAllCookieStores();
    return cookieStores.map(cookieStore => {
        cookieInfo.storeId = cookieStore.storeId;
        return browser.cookies.remove(cookieInfo);
    });
}