import { registerLanguage, highlight, configure } from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'

registerLanguage('javascript', javascript)
configure({
    tabReplace: '    ',
})

/**
 * @param { string } code
 */
export function applyCodeHighlight(code = '') {
    return highlight('javascript', code, true).value
}
