/**
 * Chrome Content Script
 *
 * @see https://developer.chrome.com/extensions/devguide
 * @see https://developer.chrome.com/extensions/content_scripts
 */

import App from '@/components/app'
import { getBestZIndexAmongChild } from '@/utils/dom'

window.addEventListener('load', init)

async function init() {
    const bestZIndex = await getBestZIndexAmongChild(document.body)
    const app = await App({ mode: 'modal', zIndex: bestZIndex + 1 })

    document.body.appendChild(app.el)

    useChromeMessageListener(() => {
        if (app.state.show) {
            app.methods.hide()
        } else {
            app.methods.show()
        }
    })
}

/**
 * @see https://developer.chrome.com/extensions/messaging
 * @param { () => void } callback
 */
function useChromeMessageListener(callback) {
    if (typeof chrome === 'undefined') {
        return false
    }

    chrome.runtime.onMessage.addListener((request) => {
        if (request?.action === 'toggle') {
            callback()
        }
    })

    return true
}
