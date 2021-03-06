const URL = "https://youtube.com";
const PREF_COOKIE_NAME = "PREF";
const VISITOR_COOKIE_NAME = "VISITOR_INFO1_LIVE";

let cookieInfo = {
	"name": PREF_COOKIE_NAME,
	"url": URL
};

async function patcher(cookieValue) {

	//move the PREF cookie into a map object
	let map = new Map();
	if(cookieValue) {
		for(let param of cookieValue.split("&")) {
			let paramPart = param.split("=");
			map.set(paramPart[0], paramPart[1]);
		}
	}

	let {status} = await getStorage().get("status");

	switch(status) {
		case "darkMode":
			map.set("f6", 400);
			break;
		case "oldLayout":
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

function setPrefCookies() {
	setCookies(cookieInfo, ".youtube.com", patcher);
}
