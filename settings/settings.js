//set the labels values
for(let label of document.getElementsByTagName("label")) {
    label.innerHTML = browser.i18n.getMessage(label.getAttribute("for"));
}

function radioChangeHandler() {
    browser.storage.sync.set({"status": this.id}).then(() => {
        setPrefCookies(this.id);
    }, defaultErrorHandler);
}

//add click listener to the radio buttons
for(let radioButton of document.getElementsByTagName("input")) {
    radioButton.onclick = radioChangeHandler;
}

//set selected radio button
browser.storage.sync.get("status").then(results => {
    if(results.status) {
        document.getElementById(results.status).checked = true;
    } else {
        document.getElementById("disabled").checked = true;
    }
}, defaultErrorHandler);