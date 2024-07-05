var accentSelection = ["é", "è", "ê", "à", "ç" ,"ù", "«", "»", "ë", "ï", "ü", "â", "ô", "î", "û"];
var uppercaseAccents = ['É', 'È', 'Ê', 'À', 'Ç', 'Ù', '«', '»', 'Ë', 'Ï', 'Ü', 'Â', 'Ô', 'Î', 'Û']

var capsLock = false;

// get tab domain, display on popup.html
async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    document.getElementById('domain-display').innerHTML = tab.url.split("/")[2]

    /* chrome:// tabs block a lot of extension functionality due to security reasons. Thus, the extension cannot operate on such tabs.
        docs.google.com has very complex js logic that completely derails the capabilities of this extension 😅
        solving the issue is either way too complicated or requires contacting Google themselves... */
    
    if ((tab.url.split("/")[2] === "docs.google.com") || tab.url.split("/")[0] === "chrome:") {
        document.getElementById("description").innerHTML = "Whoops! Can't insert text onto this page :("
    }
    else {
        document.getElementById("description").innerHTML = "Type French accents without Alt codes!"
    }
}

getCurrentTab()

// copy all French accents (lower and uppercase) to the user's clipboard - requires site permission
function copyAccents() {
    let allAccents = accentSelection.concat(uppercaseAccents)
    console.log(allAccents)
    navigator.clipboard.writeText(allAccents.join(' '))
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('b-copy').addEventListener('click', copyAccents)
});