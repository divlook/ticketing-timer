import moment from 'moment'
import {
    getConsoleSection,
    getForm,
    getButtons,
    getInputs,
    createArticle,
} from '@/utils/dom'
import { onSubmit, onReset, onClick } from '@/utils/dom.event'

document.addEventListener('DOMContentLoaded', init)

function init() {
    if (typeof window.TicketingTimer === 'undefined') {
        console.error('TicketingTimer 모듈이 선언되지 않았습니다.')
        return
    }

    console.log('TicketingTimer 모듈이 로드되었습니다.')

    const consoleSection = getConsoleSection()
    const form = getForm()
    const input = getInputs()
    const button = getButtons()

    const timer = new TicketingTimer(completeTicketing, { onLogging })

    onSubmit(form, startTicketing)
    onReset(form, resetTicketing)
    onClick(button.cancel, stopTicketing)
    setInitialValue()

    function startTicketing() {
        consoleSection.clear()

        if (!input.date.value) {
            consoleSection.add(createArticle('날짜를 입력해주세요.'))
            return
        }

        if (!input.time.value) {
            consoleSection.add(createArticle('날짜를 입력해주세요.'))
            return
        }

        const datetime = [input.date.value, ' ', input.time.value].join('')

        timer.start(datetime)
    }

    function stopTicketing() {
        timer.stop()
    }

    function completeTicketing() {
        consoleSection.clear()
        consoleSection.add(createArticle('타이머 종료!'))
    }

    function resetTicketing() {
        stopTicketing()
        consoleSection.clear()
        setTimeout(() => {
            setInitialValue()
        })
    }

    function onLogging(...msgs) {
        const text = msgs
            .map((msg) => {
                if (typeof msg === 'string') {
                    return msg
                }

                if (msg ?? null === null) {
                    return ''
                }

                return JSON.stringify(msg)
            })
            .filter((msg) => !!msg)
            .join(', ')

        createArticle(text, (article) => {
            consoleSection.clear()
            consoleSection.add(article)
        })
    }

    function setInitialValue() {
        const now = moment().add(3, 'minute')
        input.date.value = now.format('YYYY-MM-DD')
        input.time.value = now.format('HH:mm:ss')
    }
}
