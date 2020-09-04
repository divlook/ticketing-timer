document.addEventListener('DOMContentLoaded', init)

function init() {
    if (typeof window.TicketingTimer === 'undefined') {
        console.error('TicketingTimer 모듈이 선언되지 않았습니다.')
        return
    }

    console.log('TicketingTimer 모듈이 로드되었습니다.')

    const main = document.querySelector('main')
    const form = document.querySelector('form')

    const inputs = Array.from(document.querySelectorAll('input'))
    const date = inputs.find((el) => el.id === 'date')
    const time = inputs.find((el) => el.id === 'time')

    const buttons = Array.from(document.querySelectorAll('button'))
    const cancel = buttons.find((el) => el.id === 'cancel')

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

        if (!date.value) {
            main.appendChild(createArticle('날짜를 입력해주세요.'))
            return
        }

        if (!time.value) {
            main.appendChild(createArticle('날짜를 입력해주세요.'))
            return
        }

        const datetime = [
            date.value,
            ' ',
            time.value,
            ':00',
        ].join('')

        timer.start(datetime)
    }

    function stopTicketing() {
        timer.stop()
    }

    function onComplete() {
        clearMain()
        console.log('타이머 종료!')
        main.appendChild(createArticle('타이머 종료!'))
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
            main.appendChild(article)
        }
    }

    function onCancel(cb) {
        if (typeof cb !== 'function') {
            return
        }

        cancel.addEventListener('click', function() {
            console.log('cancel')
            cb()
        })
    }

    function clearMain() {
        while (main.firstChild) {
            main.removeChild(main.firstChild)
        }
    }

    function resetTicketing() {
        stopTicketing()
        clearMain()
    }
}
