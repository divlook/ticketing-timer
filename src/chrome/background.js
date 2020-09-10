/**
 * Chrome Background
 * @see https://developer.chrome.com/extensions/devguide
 * @see https://developer.chrome.com/extensions/background_pages
 */

chrome.browserAction.onClicked.addListener(onClickBrowserAction)

/**
 * @param { tabs.Tab } tab https://developer.chrome.com/extensions/tabs#type-Tab
 */
function onClickBrowserAction(tab) {
    sendChromeMessage()
}

/**
 * @see https://developer.chrome.com/extensions/messaging
 */
function sendChromeMessage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const id = tabs[0].id
        chrome.tabs.sendMessage(id, { action: 'toggle' })
    })
}
