/**
 * TODO: executeScript로 실행하거나 postMessage 사용
 *
 * @see https://developer.chrome.com/extensions/devguide
 * @see https://developer.chrome.com/extensions/content_scripts
 */

/**
 * @param { tabs.Tab } tab https://developer.chrome.com/extensions/tabs#type-Tab
 */
function onClickPageAction(tab) {
    chrome.tabs.executeScript({
        code: 'document.body.style.backgroundColor="orange"'
    })
}

chrome.pageAction.onClicked.addListener(onClickPageAction)
