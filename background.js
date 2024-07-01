chrome.commands.onCommand.addListener((command) => {
    if (command === 'activate-accents') {
        chrome.scripting.executeScript({
            target: {allFrames: true},
            files: ['popup.js']
    })
    }
});