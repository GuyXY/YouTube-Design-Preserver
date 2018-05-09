//stoi converts a string to an integer
function stoi(string) {
    return string|0;
}

//versionCompare is a function that compares two strings of semantic versions
//this function returns
//-1 if v1 is newer
//1 if v2 is newer
//0 if both are the same
function versionCompare(v1, v2) {

    v1 = v1.split(".");
    v2 = v2.split(".");

    for(let i = 0; i < v1.length; ++i) {

        const v1Part = stoi(v1[i]);
        const v2Part = stoi(v2[i]);

        if(v1Part < v2Part) {
            return 1;
        } else if(v1Part > v2Part) {
            return -1;
        }
    }
    return 0;
}

//update code
browser.runtime.onInstalled.addListener(async function(details) {
	if(details.reason == "update") {

		if(versionCompare(details.previousVersion, "2.0.0") > 0) {
			await getStorage().set({"status": "oldLayout"});
		}

		//insert future update code here!

	}
});

//as soon as the add-on gets started, it's going to patch the PREF cookie
setPrefCookies();

//automatically patch the PREF cookie as soon as it gets changed
setAutoCookiePatcher(cookieInfo, patcher);
