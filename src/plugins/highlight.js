import 'highlight.js/styles/atom-one-dark.css'
import { applyCodeHighlight } from '@/plugins/highlight.module'
import HighlightWorker from '@/plugins/highlight.worker'

/**
 * Worker
 */
let worker

const state = {
    elList: [],
}

window.addEventListener('load', () => {
    if (Worker) {
        worker = new HighlightWorker()
        worker.addEventListener('message', (event) => {
            if (state.elList.length === 0) {
                return
            }

            const el = state.elList.shift()
            el.innerHTML = event.data
        })
    }
})

/**
 * @param { HTMLElement } el
 * @param { string } code
 */
export function codeHighlight(el, code) {
    code += '\n'

    if (worker) {
        state.elList.push(el)
        worker.postMessage(code)
        return
    }

    el.innerHTML = applyCodeHighlight(code)
}
