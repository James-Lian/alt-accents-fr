var hotkey = [];

// send messages to the content script based on different hotkey inputs
// the content script will act differently depending on the message
chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs.length > 0) {
            if (command === 'activate-accents') {
                hotkey = []
                // example hotkey: Ctrl/Alt + Shift (optional) + letter 
                // retrieving the hotkey for extension dynamically (in case the user changes it)
                chrome.commands.getAll((cmds) => {
                    cmds.forEach((command) => {
                        if (command.name === "activate-accents") {
                            hotkey.push(command.shortcut.split("+"))
                        }
                    })
                });
                
                (async () => {
                    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
                    const response = await chrome.tabs.sendMessage(tab.id, {greeting: hotkey});
                    console.log(response)
                  })();
            }
            else if (command === 'move-selection-down') {
                (async () => {
                    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
                    const response = await chrome.tabs.sendMessage(tab.id, {greeting: "down"});
                    console.log(response)
                  })();
            }
            else if (command === 'move-selection-left') {
                (async () => {
                    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
                    const response = await chrome.tabs.sendMessage(tab.id, {greeting: "left"});
                    console.log(response)
                  })();
            }
            else if (command === "copy-accents") {
                (async () => {
                    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
                    const response = await chrome.tabs.sendMessage(tab.id, {greeting: "copy"});
                    console.log(response)
                  })();
            }
        }
    });
});