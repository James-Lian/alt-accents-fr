var curr_selection = 0;
const overlay = document.getElementById('box');

overlay.style.display = "block";

/* shorcut pressed */
document.addEventListener('keydown', (event) => {
    overlay.style.display = "block";
    curr_selection = 0;
});

/* shortcut released */
document.addEventListener('keyup', (event) => {
    if (event.ctrlKey && event.shiftKey && event.key)
    overlay.style.display = "none";
});

// console.log(chrome.commands.getAll())
// document.getElementById("test").innerHTML = chrome.commands.getAll()

chrome.commands.getAll((commands) => {
    console.log(commands)
  });

function showOverlay() {
    pass;
}

function hideOverlay() {
    pass;
}