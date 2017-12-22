
async function removeVisitorCookie(cookie) {
	await browser.cookies.remove(createCookieInfo(cookie));
	console.log(`removed ${cookie.name}`);
}

async function removeVisitorCookies() {
	for(let cookieStore of await browser.cookies.getAllCookieStores()) {
		removeVisitorCookie({
			"name": VISITOR_COOKIE_NAME,
			"storeId": cookieStore.id
		});
	}
}

//as soon as the add-on gets startet, it's going to delete the VISITOR cookie aand patch the PREF cookie
(async function() {
	setPrefCookies((await browser.storage.sync.get("status")).status);
	removeVisitorCookies();
})();

//automatically patch the PREF cookie as soon as it gets changed
browser.cookies.onChanged.addListener(async function(changedInfo) {
	let {cookie} = changedInfo;

	switch(cookie.name) {
		case PREF_COOKIE_NAME:
			if(changedInfo.cause != "overwrite") {
				setPrefCookie(cookie, (await browser.storage.sync.get("status")).status, changedInfo.removed)
			}
			break;

		//this cookie can break the PREF changes, so it will be removed
		case VISITOR_COOKIE_NAME:
			if(!changedInfo.removed) {
				removeVisitorCookie(cookie);
			}
	}
});