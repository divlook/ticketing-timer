import moment from 'moment'
import TicketingTimer from '@/ticketing-timer'
import {
    getConsoleSection,
    getForm,
    getButtons,
    getInputs,
    getSelects,
    createArticle,
} from '@/utils/dom'
import { onSubmit, onReset, onClick, onChange } from '@/utils/dom.event'

document.addEventListener('DOMContentLoaded', init)

function init() {
    const consoleSection = getConsoleSection()
    const form = getForm()
    const input = getInputs()
    const button = getButtons()
    const select = getSelects()

    /**
     * @type {TicketingTimer}
     */
    let timer

    onSubmit(form, startTicketing)
    onReset(form, resetTicketing)
    onClick(button.cancel, stopTicketing)
    onChange(select.ticketingType, (e) => {
        if (e.target.value) {
            consoleSection.add(createArticle(e.target.value))
        }
    })
    setInitialValue()

    function startTicketing() {
        consoleSection.clear()

        const ticketingType = select.ticketingType.value
        const isCustom = ticketingType === 'custom'
        const typeOrCallback = isCustom ? completeTicketing : ticketingType

        if (!input.date.value) {
            consoleSection.add(createArticle('날짜를 입력해주세요.'))
            return
        }

        if (!input.time.value) {
            consoleSection.add(createArticle('날짜를 입력해주세요.'))
            return
        }

        const datetime = [input.date.value, ' ', input.time.value].join('')

        timer = new TicketingTimer(typeOrCallback, { onLogging })
        timer && timer.start(datetime)
    }

    function stopTicketing() {
        timer && timer.stop()
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
