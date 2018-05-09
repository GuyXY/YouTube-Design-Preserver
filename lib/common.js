//version 2.0.0

//returns the default storage object
function getStorage() {
	return browser.storage.sync || browser.storage.local;
}
