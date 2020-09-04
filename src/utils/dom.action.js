/**
* @param { HTMLElement } el
 */
export function empty(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild)
    }
}

/**
* @param { HTMLElement } el
* @param { HTMLElement } child
 */
export function add(el, child) {
    el.appendChild(child)
}
