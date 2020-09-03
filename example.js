document.addEventListener('DOMContentLoaded', init)

function init() {
    if (typeof window.Ticketing === 'undefined') {
        console.error('Ticketing 모듈이 선언되지 않았습니다.')
        return
    }

    console.log('Ticketing 모듈이 로드되었습니다.')

    const inputs = Array.from(document.querySelectorAll('input'))
    const date = inputs.find((el) => el.id === 'date')
    const time = inputs.find((el) => el.id === 'time')
    const main = document.querySelector('main')
    const form = document.querySelector('form')

    const ticketing = new Ticketing(onComplete, {
        onLogging: onLogging,
    })

    preventSubmit()
    onSubmit(start)
    onReset(clearMain)

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

    function start() {
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

        ticketing.start(datetime)
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

    function clearMain() {
        while (main.firstChild) {
            main.removeChild(main.firstChild)
        }
    }
}
