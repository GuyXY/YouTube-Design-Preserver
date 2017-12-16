//automatically patch the PREF cookie as soon as it gets changed
browser.cookies.onChanged.addListener(changedInfo => {
	let cookie = changedInfo.cookie;

	browser.storage.sync.get("status").then(results => {
		if(cookie.name == COOKIE_NAME && changedInfo.cause != "overwrite") {
			setPrefCookie(cookie, results.status, changedInfo.removed);
		}
	}, defaultErrorHandler);
});