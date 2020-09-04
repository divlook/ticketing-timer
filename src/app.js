import moment from 'moment'
import TicketingTimer from '@/ticketing-timer'
import {
    createArticle,
    getConsoleSection,
    getForm,
    getButtons,
    getInputs,
    getSelects,
    getTextareas,
} from '@/utils/dom'
import { onSubmit, onReset, onClick, onChange } from '@/utils/dom.event'
import { createCode } from '@/utils'

document.addEventListener('DOMContentLoaded', init)

function init() {
    const consoleSection = getConsoleSection()
    const form = getForm()
    const input = getInputs()
    const button = getButtons()
    const select = getSelects()
    const textarea = getTextareas()

    const state = {
        playing: false,
    }

    /**
     * @type { TicketingTimer }
     */
    let timer
    /**
     * @type { (context) => void }
     */
    let runCode

    onSubmit(form, startTicketing)
    onReset(form, resetTicketing)
    onClick(button.cancel, stopTicketing)
    onChange(select.ticketingType, onTypeChanged)
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

        timer = new TicketingTimer(typeOrCallback, {
            onReject,
            onStart,
            onStop,
            onComplete,
            onLogging,
        })
        timer?.start(datetime)
    }

    function stopTicketing() {
        timer?.stop()
    }

    function completeTicketing() {
        consoleSection.add(createArticle('타이머가 종료되었습니다.'))
    }

    function resetTicketing(e) {
        e?.preventDefault()
        stopTicketing()
        consoleSection.clear()
        setInitialValue()
    }

    function setInitialValue() {
        const now = moment().add(3, 'minute')
        input.date.value = now.format('YYYY-MM-DD')
        input.time.value = now.format('HH:mm:ss')
    }

    /**
     * @param {boolean} playing
     */
    function setPlaying(playing) {
        state.playing = !!playing
        textarea.editor.disabled = state.playing

        if (textarea.editor.value && state.playing) {
            try {
                runCode = createCode(textarea.editor.value)
                return
            } catch (error) {
                console.error(error)
                consoleSection.clear()
                consoleSection.add(createArticle('에러가 발생하였습니다.'))
                createArticle(error?.message, (article) => {
                    consoleSection.add(article)
                })
                stopTicketing()
            }
        }

        runCode = null
    }

    function onReject() {
        setPlaying(false)
    }

    function onStart() {
        setPlaying(true)
    }

    function onStop() {
        setPlaying(false)
    }

    function onComplete() {
        try {
            runCode?.()
        } catch (error) {
            console.error(error)
            consoleSection.clear()
            consoleSection.add(createArticle('에러가 발생하였습니다.'))
            createArticle(error?.message, (article) => {
                consoleSection.add(article)
            })
        }

        setPlaying(false)
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

    function onTypeChanged(e) {
        const isCustom = e.target.value === 'custom'

        textarea.editor.disabled = !isCustom
    }
}
