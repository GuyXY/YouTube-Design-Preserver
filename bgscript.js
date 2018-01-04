//as soon as the add-on gets startet, it's going to patch the PREF cookie
(async function() {
	setPrefCookies((await browser.storage.sync.get("status")).status);
})();

//automatically patch the PREF cookie as soon as it gets changed
browser.cookies.onChanged.addListener(async function(changedInfo) {
	let {cookie} = changedInfo;

	if(cookie.name == PREF_COOKIE_NAME && changedInfo.cause != "overwrite") {
		setPrefCookie(cookie, (await browser.storage.sync.get("status")).status, changedInfo.removed);
	}
});