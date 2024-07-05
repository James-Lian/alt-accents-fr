var accentSelection = ["é", "è", "ê", "à", "ç" ,"ù", "«", "»", "ë", "ï", "ü", "â", "ô", "î", "û"];
var uppercaseAccents = ['É', 'È', 'Ê', 'À', 'Ç', 'Ù', '«', '»', 'Ë', 'Ï', 'Ü', 'Â', 'Ô', 'Î', 'Û']

var overlay;

function init() {
    const container = document.createElement('div');
    container.id = "overlay-container-accents-jj";
    document.body.append(container);
    
    overlay = document.createElement('div');
    overlay.id = "overlay-box-accents-jj";
    
    container.appendChild(overlay);
    
    const accents1 = document.createElement('div');
    accents1.className = 'accents-popup-overlay-wrapper-jj';
    overlay.appendChild(accents1);
    
    for (let i=0; i<6; i++) {
        var accent = document.createElement('h1');
        accent.innerHTML = accentSelection[i];
        accent.className = 'accents-text-overlay-styles-jj';
        accent.id = accentSelection[i];
        accents1.appendChild(accent);
    }

    const accents2 = document.createElement('div');
    accents2.className = 'accents-popup-overlay-wrapper-jj';
    overlay.appendChild(accents2);
    
    for (let i=6; i<15; i++) {
        var accent = document.createElement('h1');
        accent.innerHTML = accentSelection[i];
        accent.className = 'accents-text-overlay-styles-jj';
        accent.id = accentSelection[i];
        accents2.appendChild(accent);
    }
    
    overlay.style.display = "none";
}

init();

var selectedAccent = "";

/* INPUT */

var currSelection = -1;
var isActive = false;

var altCtrlPressed = false;
var keyPressed = false;
var capsLock = false;

var hotkey;
// full shortcut pressed - received message, input handled by background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => { 
    if (request.greeting === "down") {
        sendResponse({received: "received"});
        if (isActive === true) {
            if ((currSelection % accentSelection.length >= 0) && (currSelection % accentSelection.length <= 5)) {
                currSelection = 6;
                updateOverlay(currSelection);
            }
            else {
                currSelection = 0;
                updateOverlay(currSelection);
            }
        }
    }
    else if (request.greeting === "left") {
        sendResponse({received: "received"});
        if (isActive === true) {
            if (currSelection === 0) {
                currSelection = accentSelection.length - 1;
                updateOverlay(currSelection);
            }
            else {
                currSelection --;
                updateOverlay(currSelection);
            }
        }
    }
    else if (request.greeting === "copy") {
        let allAccents = accentSelection.concat(uppercaseAccents)
        navigator.clipboard.writeText(allAccents.join(' '));
        notification("Accents copied to clipboard!")
    }
    else if (request.greeting) {
        hotkey = request.greeting;
        sendResponse({received: hotkey});
        keyPressed = true;
        isActive = true;
        overlay.style.display = "block";
    }
});

function handleKeyPress(event) {
    console.log(event.key)
    if (event.altKey || event.ctrlKey) { // Alt or Ctrl key pressed
        if ((hotkey[0][0].toLowerCase() === "alt" && event.altKey) || (hotkey[0][0].toLowerCase() === "ctrl" && event.ctrlKey)) {
            altCtrlPressed = true;
        }
    }
    else if (event.getModifierState('CapsLock')) {
        capsLock = true;
        updateOverlay(currSelection);
    }
    else if (!event.getModifierState('CapsLock')) {
        capsLock = false;
        updateOverlay(currSelection);
    }
    
    if (!isActive && (altCtrlPressed && keyPressed)) { // if they were both pressed at the same times, the extension is activated
        overlay.style.display = "block";
        isActive = true;
    }
}

function handleKeyRelease(event) {
    console.log(event.key)
    if (isActive && (!event.altKey || !event.ctrlKey)) { // Alt or Ctrl key released - extension is deactivated
        if ((hotkey[0][0].toLowerCase() === "alt" && !event.altKey) || (hotkey[0][0].toLowerCase() === "ctrl" && !event.ctrlKey)) {
            isActive = false;
            altCtrlPressed = false;
            keyPressed = false;
            overlay.style.display = "none";
            if (capsLock) {
                selectedAccent = uppercaseAccents[currSelection % accentSelection.length]
            }
            else {
                selectedAccent = accentSelection[currSelection % accentSelection.length]
            }
            currSelection = -1;
            insertAccent();
        }
    }
    if (isActive && event.key.toLowerCase() === hotkey[0].slice(-1)[0].toLowerCase()) {
        keyPressed = false;
        currSelection ++;
        updateOverlay(currSelection % accentSelection.length);
    }
}

/* shorcut pressed */
document.addEventListener('keydown', handleKeyPress);

/* shortcut or key released */
document.addEventListener('keyup', handleKeyRelease);

function updateOverlay(accentIndex) {
    if (capsLock) {
        for (let i=0; i<accentSelection.length; i++) {
            document.getElementById(accentSelection[i]).innerHTML = uppercaseAccents[i]
        }
    }
    else {
        for (accent of accentSelection) {
            document.getElementById(accent).innerHTML = accent
        }    
    }

    for (accent of accentSelection) {
        document.getElementById(accent).style.backgroundColor = "#002153";
    }
    document.getElementById(accentSelection[accentIndex]).style.backgroundColor = "#ce1221";
}

function insertAccent() {
    var activeElement = document.activeElement;

    // if the website if Google Docs, then the active element will be inside the iFrame
    if (isGoogleDocs()) {
        navigator.clipboard.writeText(selectedAccent);
        notification("Accent copied to clipboard (Google Docs).")
    }
    else {
        if (activeElement && (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT")) {
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            activeElement.value = activeElement.value.substring(0, start) + selectedAccent + activeElement.value.substring(end);
            activeElement.selectionStart = activeElement.selectionEnd = start + 1;
        }
        else if (activeElement && activeElement.isContentEditable) {
            var selection = window.getSelection()
            console.log(selection)
            if (window.getSelection) {
                console.log(selection.getRangeAt, selection.rangeCount)
                if (selection.getRangeAt && selection.rangeCount) {
                    console.log('my buddy bro')
                    var range = selection.getRangeAt(0);
                    range.deleteContents()
                    range.insertNode(document.createTextNode(selectedAccent));
    
                    selection.modify("move", "right", "character")
                }
            }
            else {
                console.log('well what do you know')
            }
        }
    }
}

/* Google Docs functionality */
// the complex javascript logic on Google Docs pages blocks the previous event listeners in some way
// the following code will circumvent that to allow the extension to function on Google Docs

function isGoogleDocs() {
    // true or false
    return window.location.host === 'docs.google.com' && window.location.pathname.startsWith('/document')
}

window.addEventListener('load', () => {
    if (isGoogleDocs()) {
        var editingIFrame = document.querySelector('iframe.docs-texteventtarget-iframe');
        if (editingIFrame) {
            if (editingIFrame.contentDocument) {
                editingIFrame.contentDocument.addEventListener("keydown", handleKeyPress);
                editingIFrame.contentDocument.addEventListener("keyup", handleKeyRelease);
            }
        }
    }
});

function notification(text) {
    if (!window.Notification) {
        console.log('Alt-Accents: Browser does not support notifications.');
    }
    else {
        if (Notification.permission === "granted") {
            const notify = new Notification('Alt-Accents', {
                body: text,
                icon: "images/icon48.png"
            });
            notify.onclick = () => {
                notify.close();
                window.parent.focus();
            }
        }
        else {
            Notification.requestPermission().then((p) => {
                if (p === "granted") {
                    const notify = new Notification('Alt-Accents', {
                        body: text,
                        icon: "images/icon48.png"
                    });
                    notify.onclick = () => {
                        notify.close();
                        window.parent.focus();
                    }
                } else {
                    console.log("Alt-Accents: User blocked notifications.");
                }
            }).catch((err) => {
                console.log(err)
            });
        }
    }
}