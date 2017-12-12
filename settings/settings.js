//set the labels values
document.getElementById("oldLayoutLabel").innerHTML = browser.i18n.getMessage("oldLayout");
document.getElementById("darkModeLabel").innerHTML = browser.i18n.getMessage("darkMode");
document.getElementById("disabledLabel").innerHTML = browser.i18n.getMessage("disabled");

function radioChangeHandler() {
    browser.storage.sync.set({"status": this.id});
}

//add click listener to the radio buttons
document.getElementById("oldLayout").onclick = radioChangeHandler;
document.getElementById("darkMode").onclick = radioChangeHandler;

let disabledRadioButton = document.getElementById("disabled");
disabledRadioButton.onclick = radioChangeHandler;


//set selected radio button
browser.storage.sync.get("status").then(results => {
    console.log(results);
    if(results.status) {
        document.getElementById(results.status).checked = true;
    } else {
        disabledRadioButton.checked = true;
    }
}, errorMessage => {
    console.error(errorMessage);
});

//apply css so that the labels are on the right side of the radio buttons
var fileref = document.createElement("link");
fileref.rel = "stylesheet";
fileref.type = "text/css";
fileref.href = "settings-ltr.css";
document.getElementsByTagName("head")[0].appendChild(fileref);
