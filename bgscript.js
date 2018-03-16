//update code
browser.runtime.onInstalled.addListener(async function(details) {
	if(details.reason == "update") {

		if(versionCompare(details.previousVersion, "2.0.0") > 0) {
			await (await getStorage()).set({"status": "oldLayout"});
		}

		//insert future update code here!

	}
});

//as soon as the add-on gets started, it's going to patch the PREF cookie
setPrefCookies();

//automatically patch the PREF cookie as soon as it gets changed
setAutoCookiePatcher(cookieInfo, patcher);