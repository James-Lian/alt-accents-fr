var accentSelection = ["é", "è", "ê", "à", "ç" ,"ù", "«", "»", "ë", "ï", "ü", "â", "ô", "î", "û"];


async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
   document.getElementById('domain-display').innerHTML = tab.url.split("/")[2]

   if (tab.url.split("/")[2] === "docs.google.com") {
    document.getElementById("description").innerHTML = "Oops! Unfortunately, it is difficult to insert text into Google Docs and other related pages. When using this function, the accent will be copied to your clipboard instead."
   }
   else {
    document.getElementById("description").innerHTML = "Type French accents without Alt codes!"
   }
}

getCurrentTab()