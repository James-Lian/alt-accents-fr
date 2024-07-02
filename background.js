chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs.length > 0) {
            if (command === 'activate-accents') {
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id, allFrames: true},
                    files: ['popup.js']
                })
            }
        }
    })
});