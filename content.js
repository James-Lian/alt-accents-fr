var accentSelection = ["é", "è", "ê", "à", "ç" ,"ù", "«", "»", "ë", "ï", "ü", "â", "ô", "î", "û"];
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

init()

/* INPUT */

var currSelection = -1;
var isActive = false;

var altCtrlPressed = false;
var keyPressed = false;

var hotkey;
// full shortcut pressed - received message, input handled by background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => { 
    if (request.greeting === "move") {
        sendResponse({received: "received"});
        if (isActive) {
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
    else if (request.greeting) {
        hotkey = request.greeting;
        sendResponse({received: hotkey});
        keyPressed = true;
        isActive = true;
        overlay.style.display = "block";
    }
});

function handleKeyPress(event) {
    if (event.altKey || event.ctrlKey) { // Alt or Ctrl key pressed
        if ((hotkey[0][0].toLowerCase() === "alt" && event.altKey) || (hotkey[0][0].toLowerCase() === "ctrl" && event.ctrlKey)) {
            altCtrlPressed = true;
        }
    }
    
    if (!isActive && (altCtrlPressed && keyPressed)) { // if they were both pressed at the same times, the extension is activated
        overlay.style.display = "block";
        isActive = true;
    }
}

function handleKeyRelease(event) {
    if (isActive && (!event.altKey || !event.ctrlKey)) { // Alt or Ctrl key released - extension is deactivated
        if ((hotkey[0][0].toLowerCase() === "alt" && !event.altKey) || (hotkey[0][0].toLowerCase() === "ctrl" && !event.ctrlKey)) {
            isActive = false;
            altCtrlPressed = false;
            keyPressed = false;
            overlay.style.display = "none";
            currSelection = -1;
            insertAccent(accentSelection[currSelection]);
        }
    }
    if (isActive && event.key === hotkey[0].slice(-1)[0].toLowerCase()) {
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
    for (accent of accentSelection) {
        document.getElementById(accent).style.backgroundColor = "#002153";
    }
    overlay.style.display = "block";
    document.getElementById(accentSelection[accentIndex]).style.backgroundColor = "#ce1221";
}

function insertAccent(text) {
    const activeElement = document.activeElement;

    if (activeElement && (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT")) {
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
    }
}