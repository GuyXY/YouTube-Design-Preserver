let currentStatus;

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

//automatically patch the PREF cookie as soon as it gets changed
browser.cookies.onChanged.addListener(changedInfo => {
	let cookie = changedInfo.cookie;
	if(cookie.name == cookieName && changedInfo.cause != "overwrite") {
		const patchedCookieValue = patchCookie(cookie.value, currentStatus);
		if(cookie.value != patchedCookieValue) {
			cookie.value = patchedCookieValue;
			setCookie(cookie);
		}
	}
});