//set the labels values
for(let label of document.getElementsByTagName("label")) {
    label.innerHTML = browser.i18n.getMessage(label.getAttribute("for"));
}

function radioChangeHandler() {
    browser.storage.sync.set({"status": this.id}).catch(defaultErrorHandler);

    if(this.id == "disabled") {
        return;
    }

    browser.cookies.getAllCookieStores().then(cookieStores => {
        for(let cookieStore of cookieStores) {

            browser.cookies.get({
                "url": url,
                "name": cookieName,
                "storeId": cookieStore.id
            }).then(cookie => {
        
                //if the PREF cookie doesn't exist yet, create it!
                if(!cookie) {
                    cookie = {
                        "url": url,
                        "name": cookieName,
                        "value": ""
                    };
                }
        
                cookie.value = patchCookie(cookie.value, this.id);
                setCookie(cookie);
        
            }, defaultErrorHandler);
        }
    }, defaultErrorHandler);
}

//add click listener to the radio buttons
for(let radioButton of document.getElementsByTagName("input")) {
    radioButton.onclick = radioChangeHandler;
}

//set selected radio button
browser.storage.sync.get("status").then(results => {
    console.log(results);
    if(results.status) {
        document.getElementById(results.status).checked = true;
    } else {
        document.getElementById("disabled").checked = true;
    }
}, defaultErrorHandler);
