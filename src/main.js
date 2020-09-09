import '@/styles/main.css'
import App from '@/components/app'

const app = App()
document.addEventListener('DOMContentLoaded', async () => {
    const { el } = await app

    document.querySelector('#app').appendChild(el)
})
