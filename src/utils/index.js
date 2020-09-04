export function n2s(n) {
    return String(n ?? '')
}

export function prefill(target = '', length = 2, fillStr = ' ') {
    return n2s(target).padStart(length, n2s(fillStr))
}

export function timestamp(texts, ...args) {
    return texts.map((text, key) => {
        const arg = n2s(args[key])

        if (arg) {
            text += prefill(arg, 2, '0')
        }

        return text
    }).join('')
}
