import { messageType } from '@/chrome/constant'

/**
 * Chrome Content Script
 *
 * @see https://developer.chrome.com/extensions/devguide
 * @see https://developer.chrome.com/extensions/content_scripts
 */

injectScript(chrome.extension.getURL('chrome/inject.js'), 'body')

chrome.runtime.onMessage.addListener((request) => {
    window.postMessage({
        type: messageType,
        request,
    })
})

/**
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} file_path Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 * @see    {@link https://gist.github.com/devjin0617/3e8d72d94c1b9e69690717a219644c7a}
 * @see    {@link http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
 */
function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0]
    var script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', file_path)
    node.appendChild(script)
}
