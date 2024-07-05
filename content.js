var accentSelection = ["é", "è", "ê", "à", "ç" ,"ù", "«", "»", "ë", "ï", "ü", "â", "ô", "î", "û"];
var uppercaseAccents = ['É', 'È', 'Ê', 'À', 'Ç', 'Ù', '«', '»', 'Ë', 'Ï', 'Ü', 'Â', 'Ô', 'Î', 'Û']

// overlay is the div container containing a translucent display of all the French accents, from which the user can select one through hotkeys
var overlay;

// init(): create all the html to be injected
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
    
    // hide the overlay for now
    overlay.style.display = "none";
}

init();

var selectedAccent = "";

/* 
INPUT and LOGIC 
How the extension works:
    ex. activate-accents = Alt+W
    
    1) 'activate' the extension by pressing Alt+W
        this shows the overlay containing the div container and a list of all the French accents
    2) while holding down the modifier key (which in this case is Alt), continue pressing the letter key (W) to cycle through the list
        your selected accent will be highlighted in red
    3) upon reaching your desired accent, release the modifier key to deactive the extension
        your French accent will be inserted into whatever editable element your mouse cursor is currently focused on

    the move-selection-down and move-selection-left gives the user more options to efficiently select their desired accent
*/

// currSelection: cursor position in the overlay
// -1: no accent selected (extension inactive)
var currSelection = -1;
var isActive = false;

var altCtrlPressed = false;
var keyPressed = false;
var capsLock = false;

// hotkey: received from background.js message (retrieved in case the user changes it)
var hotkey;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // move-selection-down: (default Alt+S) moves the cursor down a row in the overlay
    if (request.greeting === "down") {
        sendResponse({received: "received"});
        // if the overlay is active, change the cursor position (currSelection)
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
    // move-selection-left: (default Alt+A) moves the cursor to the left
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
    // copy-accents: (default Alt+P) copy an entire list of French accents
    else if (request.greeting === "copy") {
        let allAccents = accentSelection.concat(uppercaseAccents)
        navigator.clipboard.writeText(allAccents.join(' '));
        notification("Accents copied to clipboard!")
    }
    // Alt+W was pressed. Continually pressing Alt+W cycles through a list of accents. 
    else if (request.greeting) {
        hotkey = request.greeting;
        sendResponse({received: hotkey});
        keyPressed = true;
        isActive = true;
        overlay.style.display = "block";
    }
});

function handleKeyPress(event) {
    // Alt or Ctrl key pressed
    if (event.altKey || event.ctrlKey) {
        if ((hotkey[0][0].toLowerCase() === "alt" && event.altKey) || (hotkey[0][0].toLowerCase() === "ctrl" && event.ctrlKey)) {
            altCtrlPressed = true;
        }
    }
    // if CapsLock is active
    else if (event.getModifierState('CapsLock')) {
        capsLock = true;
        updateOverlay(currSelection);
    }
    // Capslock inactive
    else if (!event.getModifierState('CapsLock')) {
        capsLock = false;
        updateOverlay(currSelection);
    }
    
    // if the hotkey is pressed, show the overlay
    if (!isActive && (altCtrlPressed && keyPressed)) { 
        overlay.style.display = "block";
        isActive = true;
    }
}

function handleKeyRelease(event) {
    if (isActive && (!event.altKey || !event.ctrlKey)) {
        // if the modifier key (Alt or Ctrl) was released, then 'deactivate' the extension
        if ((hotkey[0][0].toLowerCase() === "alt" && !event.altKey) || (hotkey[0][0].toLowerCase() === "ctrl" && !event.ctrlKey)) {
            isActive = false;
            altCtrlPressed = false;
            keyPressed = false;
            overlay.style.display = "none";
            // CapsLock activated, insert an uppercase accent
            if (capsLock) {
                selectedAccent = uppercaseAccents[currSelection % accentSelection.length]
            }
            // CapsLock deactivated, insert a lowercase accent
            else {
                selectedAccent = accentSelection[currSelection % accentSelection.length]
            }
            // reset cursor position, insert accent text in user's selection
            currSelection = -1;
            insertAccent();
        }
    }
    // if letter key was released, cycle through list of accents
    if (isActive && event.key.toLowerCase() === hotkey[0].slice(-1)[0].toLowerCase()) {
        keyPressed = false;
        currSelection ++;
        updateOverlay(currSelection % accentSelection.length);
    }
}

/* shorcut or key pressed */
document.addEventListener('keydown', handleKeyPress);

/* shortcut or key released */
document.addEventListener('keyup', handleKeyRelease);

function updateOverlay(accentIndex) {
    // if CapsLock is on, replace html injected elements with upercase accents
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
    // highlight the selected accent with a red colour
    document.getElementById(accentSelection[accentIndex]).style.backgroundColor = "#ce1221";
}

function insertAccent() {
    var activeElement = document.activeElement;

    // the complex js logic behind Google Docs and similar websites blocks any attempt at actually inserting the text through code (believe me, it's really tough)
    // the accent will be instead copied to the clipboard
    if (isGoogleDocs()) {
        navigator.clipboard.writeText(selectedAccent);
        notification("Accent copied to clipboard (Google Docs).")
    }
    else {
        // if the activeElement is either a TextArea or an Input element
        if (activeElement && (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT")) {
            const start = activeElement.selectionStart; // start of user selected text
            const end = activeElement.selectionEnd; // end of user selected text

            // place the accent in between of the selection to the left and right of the cursor, and move the cursor to the right
            activeElement.value = activeElement.value.substring(0, start) + selectedAccent + activeElement.value.substring(end);
            activeElement.selectionStart = activeElement.selectionEnd = start + 1;
        }
        // if the activeElement is contentEditable
        else if (activeElement && activeElement.isContentEditable) {
            var selection = window.getSelection()
            if (window.getSelection) {
                if (selection.getRangeAt && selection.rangeCount) {
                    var range = selection.getRangeAt(0);
                    range.deleteContents()
                    range.insertNode(document.createTextNode(selectedAccent));
    
                    // move the cursor to the right
                    selection.modify("move", "right", "character")
                }
            }
            else {
                console.log('Alt-Accents: Window selection not found.')
            }
        }
    }
}

/* Google Docs functionality */
// the complex javascript logic on Google Docs pages blocks the selection and range APIs, as well as event listeners
// there is a way to circumvent event listeners, but it is extremely difficult to insert text into Google Docs at a desired position

function isGoogleDocs() {
    // true or false
    return window.location.host === 'docs.google.com' && window.location.pathname.startsWith('/document')
}

// adding event listeners directly within the Google Docs iFrame
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

// notification function
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