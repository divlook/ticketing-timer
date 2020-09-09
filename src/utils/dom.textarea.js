/**
 * @param { HTMLInputElement | HTMLTextAreaElement } el
 */
export function getCurrentLine(el) {
    const current = el.selectionStart
    const start = el.value.slice(0, current).lastIndexOf('\n') + 1
    const last = getLast(el.value, current)
    const search = el.value.slice(start, last)

    return {
        current,
        start,
        last,
        search,
    }

    function getLast(value = '', startIndex = 0) {
        let lastIndex = value.slice(startIndex).indexOf('\n')

        if (lastIndex === -1) {
            return undefined
        }

        return lastIndex + startIndex
    }
}

/**
 * @param { HTMLInputElement | HTMLTextAreaElement } el
 * @param { number } tabSize
 */
export function indentLine(el, tabSize = 4) {
    const currentLine = getCurrentLine(el)
    const match = currentLine.search.match(/^\s+/)
    const whitespace = match ? match[0].length : 0
    const nextWhitespace = (Math.floor(whitespace / tabSize) + 1) * tabSize
    const replacement = Array(nextWhitespace).fill(' ').join('')

    el.setRangeText(
        replacement,
        currentLine.start,
        currentLine.start + whitespace
    )
    el.setSelectionRange(
        currentLine.start + nextWhitespace,
        currentLine.start + nextWhitespace
    )
}

/**
 * @param { HTMLInputElement | HTMLTextAreaElement } el
 * @param { number } tabSize
 */
export function outdentLine(el, tabSize = 4) {
    const currentLine = getCurrentLine(el)
    const match = currentLine.search.match(/^\s+/)
    const whitespace = match ? match[0].length : 0
    const nextWhitespace =
        (Math.ceil((whitespace || 1) / tabSize) - 1) * tabSize
    const replacement = Array(nextWhitespace).fill(' ').join('')

    el.setRangeText(
        replacement,
        currentLine.start,
        currentLine.start + whitespace
    )
    el.setSelectionRange(
        currentLine.start + nextWhitespace,
        currentLine.start + nextWhitespace
    )
}
