let cookieName = 'PREF';
let wantedCookieValue = 'f1=50000000&f6=40008&f5=30';

browser.webRequest.onBeforeSendHeaders.addListener(details => {

	let header = details.requestHeaders.find(header => header.name == 'Cookie');
	let cookies = header.value.split('; ').filter(cookie => !cookie.startsWith(`${cookieName}=`));
	cookies.push(`${cookieName}=${wantedCookieValue}`);
	header.value = cookies.join('; ');
	
	return {"requestHeaders": details.requestHeaders};
}, {
	"urls": [
		"*://youtube.com/*",
		"*://www.youtube.com/*"
	]
}, ['blocking', 'requestHeaders']);
