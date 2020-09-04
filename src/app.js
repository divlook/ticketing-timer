'use strict'

document.addEventListener('DOMContentLoaded', init)

function init() {
    if (typeof window.TicketingTimer === 'undefined') {
        console.error('TicketingTimer 모듈이 선언되지 않았습니다.')
        return
    }

    console.log('TicketingTimer 모듈이 로드되었습니다.')

    const consoleSection = document.querySelector('section.console')
    const form = document.querySelector('form')
    const input = getInputs()
    const button = getButtons()

    const timer = new TicketingTimer(onComplete, {
        onLogging: onLogging,
    })

    preventSubmit()
    onSubmit(startTicketing)
    onReset(resetTicketing)
    onCancel(stopTicketing)

    function createArticle(text = '') {
        if (!text) {
            return null
        }

        const article = document.createElement('article')
        article.innerText = text
        return article
    }

    function preventSubmit() {
        form.addEventListener('submit', function (e) {
            e.preventDefault()
        })
    }

    function onSubmit(cb) {
        if (typeof cb !== 'function') {
            return
        }

        form.addEventListener('submit', function () {
            cb()
        })
    }

    function onReset(cb) {
        if (typeof cb !== 'function') {
            return
        }

        form.addEventListener('reset', function () {
            cb()
        })
    }

    function startTicketing() {
        clearMain()

        if (!input.date.value) {
            consoleSection.appendChild(createArticle('날짜를 입력해주세요.'))
            return
        }

        if (!input.time.value) {
            consoleSection.appendChild(createArticle('날짜를 입력해주세요.'))
            return
        }

        const datetime = [input.date.value, ' ', input.time.value, ':00'].join('')

        timer.start(datetime)
    }

    function stopTicketing() {
        timer.stop()
    }

    function onComplete() {
        clearMain()
        console.log('타이머 종료!')
        consoleSection.appendChild(createArticle('타이머 종료!'))
    }

    function onLogging(...msgs) {
        const text = msgs
            .map((msg) => {
                if (typeof msg === 'string') {
                    return msg
                }

                if (msg === null || msg === undefined) {
                    return ''
                }

                return JSON.stringify(msg)
            })
            .filter((msg) => !!msg)
            .join(', ')
        const article = createArticle(text)

        if (article) {
            clearMain()
            consoleSection.appendChild(article)
        }
    }

    function onCancel(cb) {
        if (typeof cb !== 'function') {
            return
        }

        button.cancel.addEventListener('click', function () {
            cb()
        })
    }

    function clearMain() {
        while (consoleSection.firstChild) {
            consoleSection.removeChild(consoleSection.firstChild)
        }
    }

    function resetTicketing() {
        stopTicketing()
        clearMain()
    }

    function getInputs() {
        const list = Array.from(document.querySelectorAll('input'))
        const map = new Map(list.map((el) => [el.id, el]))

        return {
            list,
            date: map.get('date'),
            time: map.get('time'),
        }
    }

    function getButtons() {
        const list = Array.from(document.querySelectorAll('button'))
        const map = new Map(list.map((el) => [el.id, el]))

        return {
            list,
            reset: map.get('reset'),
            cancel: map.get('cancel'),
            submit: map.get('submit'),
        }
    }
}
