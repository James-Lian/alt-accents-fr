var accentSelection = ["é", "è", "ê", "à", "ç" ,"ù", "«", "»", "ë", "ï", "ü", "â", "ô", "î", "û"]
var currSelection = 0;
const overlay = document.getElementById('box');

overlay.style.display = "block";

// example hotkey: Ctrl/Alt + Shift (optional) + letter 
var hotkey = [];
// retrieving the hotkey for extension dynamically (in case the user changes it)
chrome.commands.getAll((cmds) => {
    cmds.forEach((command) => {
        if (command.name === "activate-accents") {
            hotkey.push(command.shortcut.split("+"))
        }
    })
});

/* shorcut pressed */
document.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey) {
        currSelection = 0;
        updateOverlay(currSelection);
    }
});

/* shortcut released */
document.addEventListener('keyup', (event) => {
    if (event.ctrlKey || event.altKey){
        overlay.style.display = "none";
        currSelection = 0;
    }
    else if (event.code === hotkey.slice(-1)){
        currSelection += 1;
        updateOverlay(currSelection);
    }
});

function updateOverlay(accentIndex) {
    overlay.style.display = "block";
    document.getElementById(accentSelection[accentIndex]).style.backgroundColor = "#ce1221";
}

function insertAccent() {
    pass
}