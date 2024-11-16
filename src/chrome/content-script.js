import { messageType } from '@/chrome/constant'
import App from '@/components/app'
import { getBestZIndexAmongChild } from '@/utils/dom'

init()

chrome.runtime.onMessage.addListener((request) => {
    window.postMessage({
        type: messageType,
        request,
    })
})

async function init() {
    const rootEl = document.createElement('div')
    const shadowRoot = rootEl.attachShadow({ mode: 'open' })
    const styleLink = document.createElement('link')

    rootEl.dataset.name = messageType
    styleLink.setAttribute('rel', 'stylesheet')
    styleLink.setAttribute('href', chrome.runtime.getURL('styles/chrome/content-script.css'))
    shadowRoot.appendChild(styleLink)
    document.body.appendChild(rootEl)

    const app = await App({ mode: 'modal' })
    const state = {
        isMounted: false,
    }

    window.addEventListener('message', (e) => {
        const data = e.data

        if (data.type !== messageType) {
            return
        }

        if (data.request?.action === 'toggle') {
            if (!state.isMounted) {
                state.isMounted = true

                shadowRoot.appendChild(app.el)
            }

            if (app.state.show) {
                app.methods.hide()
            } else {
                app.methods.show()
                getBestZIndexAmongChild(document.body).then((bestZIndex) => {
                    app.methods.setZIndex(bestZIndex + 1)
                })
            }
        }
    })
}
