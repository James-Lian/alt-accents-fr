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

var hotkey;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.greeting) {
        hotkey = request.greeting;
        sendResponse({received: hotkey});
    }
});

var currSelection = -1;
var isActive = false;

var altCtrlPressed = false;
var keyPressed = false;

window.addEventListener('keydown', (event) => {
    if (event.altKey) {
        event.preventDefault()
    }
})

console.log("LOGGING: howdy there matey")
/* shorcut pressed */
document.addEventListener('keydown', (event) => {
    console.log(event.code)
    if (event.altKey || event.ctrlKey) { // Alt or Ctrl key pressed
        if (hotkey[0][0].toLowerCase() === "alt" && event.altKey) {
            altCtrlPressed = true;
            console.log('ALT KEY: hola soy dora!')
        }
        else if (hotkey[0][0].toLowerCase() === "ctrl" && event.ctrlKey) {
            altCtrlPressed = true;
        }
    }
    else if (hotkey != undefined && (event.key.toLowerCase() === hotkey[0].slice(-1)[0].toLowerCase())) { // the action key (e.g. 'S') is pressed
        keyPressed = true;
        console.log('ACTION KEY: moy boy')
    }

    if (!isActive && (altCtrlPressed && keyPressed)) { // if they were both pressed at the same times, the extension is activated
        overlay.style.display = "block";
        isActive = true;
    }
});

/* shortcut or key released */
document.addEventListener('keyup', (event) => {
    console.log("Ok")
    if (isActive && (event.altKey || event.ctrlKey)) { // Alt or Ctrl key released - extension is deactivated
        if (hotkey[0][0].toLowerCase() === "alt" && event.altKey) {
            isActive = false;
            altCtrlPressed = false;
            overlay.style.display = "none";
            currSelection = -1;
            insertAccent(accentSelection[currSelection])
        }
        else if (hotkey[0][0].toLowerCase() === "ctrl" && event.ctrlKey) {
            isActive = false;
            altCtrlPressed = false;
            overlay.style.display = "none";
            currSelection = -1;
            insertAccent(accentSelection[currSelection])
        }
    }
    else if (isActive && (event.key.toLowerCase() === hotkey[0].slice(-1)[0].toLowerCase())) { // action key is released - cycling through the accents
        keyPressed = false;
        currSelection ++;
        updateOverlay(currSelection % accentSelection.length);
    }
});

function updateOverlay(accentIndex) {
    if (accentIndex === 0) {
        document.getElementById(accentSelection[accentSelection.length-1]).style.backgroundColor = "#002153";
    }
    else {
        document.getElementById(accentSelection[accentIndex-1]).style.backgroundColor = "#002153";
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