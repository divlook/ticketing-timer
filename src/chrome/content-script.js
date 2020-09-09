import App from '@/components/app'
import { getBestZIndexAmongChild } from '@/utils/dom'

const isChromeMode = ENV_MODE === 'chrome'

window.addEventListener('load', init)

async function init() {
    const bestZIndex = await getBestZIndexAmongChild(document.body)
    const app = await App({ mode: 'modal', show: true, zIndex: bestZIndex })

    document.body.appendChild(app.el)

    console.log('isChromeMode', isChromeMode)
}
