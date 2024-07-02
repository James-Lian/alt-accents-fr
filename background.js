var hotkey = [];

chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs.length > 0) {
            if (command === 'activate-accents') {
                // example hotkey: Ctrl/Alt + Shift (optional) + letter 
                // retrieving the hotkey for extension dynamically (in case the user changes it)
                chrome.commands.getAll((cmds) => {
                    cmds.forEach((command) => {
                        if (command.name === "activate-accents") {
                            hotkey.push(command.shortcut.split("+"))
                        }
                    })
                });
                // running content.js script
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id, allFrames: true},
                    files: ['content.js']
                })
            }
        }
    });
});