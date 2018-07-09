//set the labels values
for(let label of document.getElementsByTagName("label")) {
    label.innerText = browser.i18n.getMessage(label.getAttribute("for"));
}

async function radioChangeHandler() {
    await getStorage().set({"status": this.id});
    setPrefCookies();
}

//add click listener to the radio buttons
for(let radioButton of document.getElementsByTagName("input")) {
    radioButton.onclick = radioChangeHandler;
}

//set selected radio button
(async function() {
    let results = await getStorage().get("status");
    if(results.status) {
        document.getElementById(results.status).checked = true;
    } else {
        document.getElementById("disabled").checked = true;
    }
})();

//init "fix it" button
let fixItButton = document.getElementsByTagName("button")[0];
fixItButton.innerText = browser.i18n.getMessage("fixIt");
fixItButton.onclick = async function() {
    await removeCookies({
        "url": URL,
        "name": VISITOR_COOKIE_NAME
    });
}

//init "not working" text
document.getElementsByTagName("div")[0].innerText = browser.i18n.getMessage("notWorking");
