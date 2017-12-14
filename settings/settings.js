//set the labels values
for(let label of document.getElementsByTagName("label")) {
    label.innerHTML = browser.i18n.getMessage(label.getAttribute("for"));
}

function radioChangeHandler() {
    browser.storage.sync.set({"status": this.id}).catch(defaultErrorHandler);
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

//apply css so that the labels are on the right side of the radio buttons
var fileref = document.createElement("link");
fileref.rel = "stylesheet";
fileref.type = "text/css";
fileref.href = "settings-ltr.css";
document.getElementsByTagName("head")[0].appendChild(fileref);
