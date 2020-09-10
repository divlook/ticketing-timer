import * as dom from '@/utils/dom'

/**
 * @param { HTMLElement } root
 */
export function findConsoleSection(root) {
    const el = root.querySelector('.tta-console')

    return {
        el,
        clear,
        add,
    }

    function clear() {
        dom.empty(el)
    }

    function add(child) {
        dom.add(el, child)
    }
}

/**
 * @param { HTMLElement } root
 */
export function findForm(root) {
    const form = root.querySelector('form')

    preventSubmit()

    return form

    function preventSubmit() {
        form.addEventListener('submit', function (e) {
            e.preventDefault()
        })
    }
}

/**
 * @param { HTMLElement } root
 */
export function findInputs(root) {
    const list = Array.from(root.querySelectorAll('input'))
    const map = new Map(list.map((el) => [el.dataset.id, el]))

    return {
        list,
        date: map.get('date'),
        time: map.get('time'),
    }
}

/**
 * @param { HTMLElement } root
 */
export function findButtons(root) {
    const list = Array.from(root.querySelectorAll('button'))
    const map = new Map(list.map((el) => [el.dataset.id, el]))

    return {
        list,
        hide: map.get('hide'),
        reset: map.get('reset'),
        cancel: map.get('cancel'),
        submit: map.get('submit'),
    }
}

/**
 * @param { HTMLElement } root
 */
export function findSelects(root) {
    const list = Array.from(root.querySelectorAll('select'))
    const map = new Map(list.map((el) => [el.dataset.id, el]))

    return {
        list,
        ticketingType: map.get('ticketing-type'),
    }
}

/**
 * @param { HTMLElement } root
 */
export function findEditors(root) {
    /**
     * @type { HTMLTextAreaElement }
     */
    const textarea = root.querySelector('[data-id="editor"]')
    const preview = root.querySelector('[data-id="editor-preview"]')
    const list = [textarea, preview]

    return {
        list,
        textarea,
        preview,
    }
}

/**
 * @param { HTMLElement } root
 */
export function findContainer(root) {
    /**
     * @type { HTMLDivElement }
     */
    const el = root.querySelector('.tta-container')

    return el
}
