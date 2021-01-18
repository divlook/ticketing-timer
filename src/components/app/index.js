import moment from '@/plugins/moment'
import TicketingTimer from '@/ticketing-timer'
import '@/styles/app.scss'
import {
    findConsoleSection,
    findForm,
    findButtons,
    findInputs,
    findSelects,
    findEditors,
    findContainer,
    findModalBackdrop,
} from '@/components/app/dom'
import template from '@/components/app/template'
import { codeHighlight } from '@/plugins/highlight'
import { createCode } from '@/utils'
import { renderTemplate, createArticle } from '@/utils/dom'
import {
    onSubmit,
    onReset,
    onClick,
    onChange,
    onInput,
    onKeydown,
    onScroll,
    onAnimationend,
} from '@/utils/dom.event'
import { indentLine, outdentLine } from '@/utils/dom.textarea'

/**
 * @typedef State
 * @property { boolean } playing 기본 값 : false
 * @property { boolean } isModalMode 기본 값 : false
 * @property { boolean } show modal 상태
 * - 기본 값 : false
 * - `mode`가 `modal`일 때만 유효함
 * @property { number } zIndex z-index
 * - 기본 값 : 1
 * - `mode`가 `modal`일 때만 유효함
 * @property { number } modalAnimationDuration 모달의 애니메이션 길이
 * - 단위 : ms
 * - 기본 값 : 300
 * - `mode`가 `modal`일 때만 유효함
 */

/**
 * @typedef Props
 * @property { 'modal' } [mode]
 * @property { boolean } [show] modal 상태
 * - 기본 값 : false
 * - `true`일 경우 modal이 바로 보임
 * - `mode`가 `modal`일 때만 유효함
 * @property { number } [zIndex] z-index
 * - 기본 값 : 1
 * - `mode`가 `modal`일 때만 유효함
 * @property { number } [modalAnimationDuration] 모달의 애니메이션 길이
 * - 단위 ms
 * - 기본 값 : 300
 * - `mode`가 `modal`일 때만 유효함
 */

/**
 * ClassName
 */
const classes = {
    state: {
        show: 'tta-state-show',
        hide: 'tta-state-hide',
        hidden: 'tta-state-hidden',
    },
    mode: {
        modal: 'tta-mode-modal',
    },
}

/**
 * App
 * @param { Props } props
 */
async function App(props = {}) {
    const el = renderTemplate(template())
    const consoleSection = findConsoleSection(el)
    const form = findForm(el)
    const input = findInputs(el)
    const button = findButtons(el)
    const select = findSelects(el)
    const editor = findEditors(el)
    const container = findContainer(el)
    const modalBackdrop = findModalBackdrop(el)

    /**
     * @type { State }
     */
    const state = {
        playing: false,
        isModalMode: false,
        show: false,
        zIndex: 1,
        modalAnimationDuration: 300,
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
    onClick(button.hide, hide)
    onClick(modalBackdrop, hide)
    onChange(select.ticketingType, onTypeChanged)
    onInput(editor.textarea, onTypingEditor)
    onKeydown(editor.textarea, onTappingEditor)
    onScroll(editor.textarea, onScrollEditor)
    onAnimationend(container, onModalHidden)
    initState(props)
    initApp()
    setInitialValue()

    return {
        get el() {
            return el
        },
        get state() {
            return state
        },
        methods: {
            show,
            hide,
        },
    }

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
        editor.textarea.disabled = state.playing

        if (editor.textarea.value && state.playing) {
            try {
                runCode = createCode(editor.textarea.value)
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

        editor.textarea.disabled = !isCustom
        editor.textarea.parentElement.style.display = !isCustom ? 'none' : null
    }

    function onTypingEditor(e) {
        codeHighlight(editor.preview, e.target.value)
    }

    function onScrollEditor() {
        const left = editor.textarea.scrollLeft
        const top = editor.textarea.scrollTop

        editor.preview.scroll(left, top)
    }

    function onTappingEditor(e) {
        const shiftKey = e.shiftKey

        if (e.key === 'Tab') {
            e.preventDefault()

            if (shiftKey) {
                outdentLine(editor.textarea)
            } else {
                indentLine(editor.textarea)
            }

            codeHighlight(editor.preview, editor.textarea.value)
        }
    }

    function onModalHidden() {
        if (!state.isModalMode && state.show) {
            return
        }

        setClasses(classes.state.show, false)

        if (state.show) {
            return
        }

        setClasses(classes.state.hide, false)
        setClasses(classes.state.hidden, true)
    }

    /**
     * @param { Props } props
     */
    function initState(props) {
        if (props?.mode === 'modal') {
            state.isModalMode = true
            state.show = props?.show ?? false
            state.zIndex = props?.zIndex ?? 1
            state.modalAnimationDuration = props?.modalAnimationDuration ?? 300
        }
    }

    function initApp() {
        if (state.isModalMode) {
            el.style.zIndex = state.zIndex
            container.style.animationDuration = `${state.modalAnimationDuration}ms`
            modalBackdrop.style.animationDuration = `${state.modalAnimationDuration}ms`

            setClasses(classes.mode.modal, true)

            if (state.show) {
                setClasses(classes.state.show, true)
            } else {
                setClasses(classes.state.hidden, true)
            }

            return
        }

        setClasses(classes.mode.modal, false)
        el.style.zIndex = null
        show()
    }

    /**
     * mode가 modal일 때 사용 가능
     */
    function show() {
        state.show = true

        setClasses(classes.state.hidden, false)
        setClasses(classes.state.show, true)
    }

    /**
     * mode가 modal일 때 사용 가능
     */
    function hide() {
        state.show = false

        setClasses(classes.state.hide, true)

        setTimeout(() => {
            if (el.classList.contains(classes.state.hidden)) {
                onModalHidden()
            }
        }, state.modalAnimationDuration + 100)
    }

    function setClasses(className = null, isAdd = false) {
        if (isAdd) {
            if (!el.classList.contains(className)) {
                el.classList.add(className)
            }
        } else {
            el.classList.remove(className)
        }
    }
}

export default App
