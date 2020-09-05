import * as action from '@/utils/dom.action'

export function getConsoleSection() {
    const el = document.querySelector('section.console')

    return {
        el,
        clear,
        add,
    }

    function clear() {
        action.empty(el)
    }

    function add(child) {
        action.add(el, child)
    }
}

export function getForm() {
    const form = document.querySelector('form')

    preventSubmit()

    return document.querySelector('form')

    function preventSubmit() {
        form.addEventListener('submit', function (e) {
            e.preventDefault()
        })
    }
}

export function getInputs() {
    const list = Array.from(document.querySelectorAll('input'))
    const map = new Map(list.map((el) => [el.id, el]))

    return {
        list,
        date: map.get('date'),
        time: map.get('time'),
    }
}

export function getButtons() {
    const list = Array.from(document.querySelectorAll('button'))
    const map = new Map(list.map((el) => [el.id, el]))

    return {
        list,
        reset: map.get('reset'),
        cancel: map.get('cancel'),
        submit: map.get('submit'),
    }
}

/**
 * article 생성
 * @param { string } text
 * @param { (article: HTMLElement) => void } [onSuccess]
 */
export function createArticle(text = '', onSuccess = null) {
    if (!text) {
        return null
    }

    const article = document.createElement('article')
    article.innerText = text

    if (typeof onSuccess === 'function') {
        onSuccess(article)
    }

    return article
}

export function getSelects() {
    const list = Array.from(document.querySelectorAll('select'))
    const map = new Map(list.map((el) => [el.id, el]))

    return {
        list,
        ticketingType: map.get('ticketing-type'),
    }
}

export function getEditors() {
    /**
     * @type { HTMLTextAreaElement }
     */
    const textarea = document.getElementById('editor')
    const preview = document.getElementById('editor-preview')
    const list = [textarea, preview]

    return {
        list,
        textarea,
        preview
    }
}
