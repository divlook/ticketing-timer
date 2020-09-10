import '@/styles/main.css'
import App from '@/components/app'
import { getBestZIndexAmongChild } from '@/utils/dom.js'

document.addEventListener('DOMContentLoaded', async () => {
    const bestZIndex = await getBestZIndexAmongChild(document.body)
    const app = await App({ mode: 'modal', show: true, zIndex: bestZIndex + 1 })

    document.querySelector('#btn').addEventListener('click', () => {
        app.methods.show()
    })

    document.body.appendChild(app.el)
})
