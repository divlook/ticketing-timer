import App from '@/components/app'
import { getBestZIndexAmongChild } from '@/utils/dom'
import { messageType } from '@/chrome/constant'

window.addEventListener('load', init)

async function init() {
    const bestZIndex = await getBestZIndexAmongChild(document.body)
    const app = await App({ mode: 'modal', zIndex: bestZIndex + 1 })
    const state = {
        isMounted: false,
    }

    useChromeMessageListener(() => {
        if (!state.isMounted) {
            state.isMounted = true
            document.body.appendChild(app.el)
        }

        if (app.state.show) {
            app.methods.hide()
        } else {
            app.methods.show()
            getBestZIndexAmongChild(document.body).then((bestZIndex) => {
                app.methods.setZIndex(bestZIndex + 1)
            })
        }
    })
}

/**
 * @see https://developer.chrome.com/extensions/messaging
 * @param { () => void } callback
 */
function useChromeMessageListener(callback) {
    window.addEventListener('message', (e) => {
        const data = e.data

        if (data.type !== messageType) {
            return
        }

        if (data.request?.action === 'toggle') {
            callback()
        }
    })

    return true
}
