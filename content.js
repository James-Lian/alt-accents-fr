var accentSelection = ["é", "è", "ê", "à", "ç" ,"ù", "«", "»", "ë", "ï", "ü", "â", "ô", "î", "û"];

function init() {
    const container = document.createElement('div');
    container.id = "overlay-container-accents";
    document.body.append(container);
    
    const overlay = document.createElement('div');
    overlay.id = "overlay-box-accents";

    container.appendChild(overlay);

    const accents1 = document.createElement('div');
    accents1.className = 'accents-popup-overlay-wrapper';
    overlay.appendChild(accents1);

    for (let i=0; i<6; i++) {
        var accent = document.createElement('h1');
        accent.innerHTML = accentSelection[i];
        accent.className = 'accents-text-overlay-styles';
        accent.id = accentSelection[i];
        accents1.appendChild(accent);
    }

    const accents2 = document.createElement('div');
    accents2.className = 'accents-popup-overlay-wrapper';
    overlay.appendChild(accents2);

    for (let i=6; i<15; i++) {
        var accent = document.createElement('h1');
        accent.innerHTML = accentSelection[i];
        accent.className = 'accents-text-overlay-styles';
        accent.id = accentSelection[i];
        accents2.appendChild(accent);
    }

    overlay.style.display = "block";
}

init()

window.onload = function() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL('content.css');
    
    document.head.appendChild(link);
}

var hotkey;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    hotkey = request.greeting;
    sendResponse({received: true});
});

var currSelection = 0;
var isActive = false;

/* shorcut pressed */
document.addEventListener('keydown', (event) => {
    if (!isActive && (event.altKey || event.ctrlKey) && event.code === hotkey.slice(-1)) {
        isActive = True
    }
    else if (isActive && (event.altKey || event.ctrlKey)) {
        currSelection = 0;
        updateOverlay(currSelection);
    }
});

/* shortcut or key released */
document.addEventListener('keyup', (event) => {
    if (isActive && (event.ctrlKey || event.altKey)) {
        overlay.style.display = "none";
        currSelection = 0;
        isActive = false
        insertAccent(accentSelection[currSelection])
    }
    else if (isActive && (event.code === hotkey.slice(-1))) {
        currSelection ++;
        updateOverlay(currSelection);
    }
});

function updateOverlay(accentIndex) {
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