/**
 * Use Event Listener
 * @param { HTMLElement } el
 * @param { string } eventName
 * @param { (e: Event) => void } cb
 * @param { any } [option]
 */
export function useEventListener(el, eventName, cb, option = false) {
    el.addEventListener(
        eventName,
        function (e) {
            cb.call(this, e)
        },
        option
    )
}

/**
 * On Submit
 * @param { HTMLFormElement } el
 * @param { (e: Event) => void } cb
 * @param { any } [option]
 */
export function onSubmit(el, cb, option) {
    useEventListener(el, 'submit', cb, option)
}

/**
 * On Reset
 * @param { HTMLFormElement } el
 * @param { (e: Event) => void } cb
 * @param { any } [option]
 */
export function onReset(el, cb, option) {
    useEventListener(el, 'reset', cb, option)
}

/**
 * On Click
 * @param { HTMLElement } el
 * @param { (e: Event) => void } cb
 * @param { any } [option]
 */
export function onClick(el, cb, option) {
    useEventListener(el, 'click', cb, option)
}

/**
 * On Change
 * @param { HTMLElement } el
 * @param { (e: Event) => void } cb
 * @param { any } [option]
 */
export function onChange(el, cb, option) {
    useEventListener(el, 'change', cb, option)
}

/**
 * On Input
 * @param { HTMLInputElement | HTMLTextAreaElement } el
 * @param { (e: Event) => void } cb
 * @param { any } [option]
 */
export function onInput(el, cb, option) {
    useEventListener(el, 'input', cb, option)
}

/**
 * On Keydown
 * @param { HTMLInputElement | HTMLTextAreaElement } el
 * @param { (e: Event) => void } cb
 * @param { any } [option]
 */
export function onKeydown(el, cb, option) {
    useEventListener(el, 'keydown', cb, option)
}

/**
 * On Scroll
 * @param { HTMLElement } el
 * @param { (e: Event) => void } cb
 * @param { any } [option]
 */
export function onScroll(el, cb, option) {
    useEventListener(el, 'scroll', cb, option)
}
