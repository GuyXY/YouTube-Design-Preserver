//set the labels values
for(let label of document.getElementsByTagName("label")) {
    label.innerHTML = browser.i18n.getMessage(label.getAttribute("for"));
}

async function radioChangeHandler() {
    await browser.storage.sync.set({"status": this.id});
    setPrefCookies();
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

document.getElementsByTagName("button")[0].onclick = async function() {
    await removeCookies({
        "url": URL,
        "name": VISITOR_COOKIE_NAME
    });
}