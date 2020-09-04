import moment from 'moment'
import logger from '@/utils/logger'
import { timestamp } from '@/utils'
import * as callbacks from '@/callbacks'

/**
 * @typedef { 'ktx' | 'srt' } TicketingType
 */

/**
 * Logger
 */
const log = logger()
log.clear = true

/**
 * TicketingTimer Options
 */
export const ticketingOptions = {
    onLogging: null,
}

/**
 * TicketingTimer
 *
 * @example
 * const timer = new TicketingTimer('ktx')
 * timer.start('2020-09-02 12:21:00')
 */
class TicketingTimer {
    #input = 0
    #player
    #ticketingType
    #callback
    /**
     * @type { Map<TicketingType, () => void> }
     */
    #callbackMap = new Map()
    #options = { ...ticketingOptions }
    #log = log

    /**
     * @param { TicketingType | (() => void) } typeOrCallback
     * 타이머 종료 후 실행할 `callback` 또는 `type`. `type` 입력시 해당 `callback` 실행
     * @param { ticketingOptions } [options]
     */
    constructor(typeOrCallback, options = {}) {
        this.init()
        this.setOptions(options)

        if (typeof typeOrCallback === 'function') {
            this.#callback = typeOrCallback
            this.#ticketingType = 'custom'
            return
        }

        if (this.#callbackMap.has(typeOrCallback)) {
            this.#callback = this.#callbackMap.get(typeOrCallback)
            this.#ticketingType = typeOrCallback
            return
        }

        this.log.notice = 'callback이 없습니다.'
    }

    /**
     * hostname 확인
     * @param {TicketingType} type
     */
    checkHostname(type) {
        if (type === 'ktx' && location.hostname !== 'www.letskorail.com') {
            this.log('www.letskorail.com 에서만 사용할 수 있습니다.')
            return false
        }

        if (type === 'srt' && location.hostname !== 'etk.srail.kr') {
            this.log('etk.srail.kr 에서만 사용할 수 있습니다.')
            return false
        }

        return true
    }

    /**
     * 타이머 시작
     * @public
     * @param { string } datetime YYYY-MM-DD HH:mm:ss (ex '2020-09-02 12:21:00')
     */
    start(datetime) {
        const isCustom = this.#ticketingType === 'custom'
        const isAllowedHostname = this.checkHostname(this.#ticketingType)

        this.stop()

        if (!isCustom && !isAllowedHostname) {
            return
        }

        if (!datetime) {
            this.log('날짜 및 시간을 입력해주세요.')
            return
        }

        this.#input = moment(datetime).valueOf()
        this.#player = setInterval(() => {
            this.timeupdate()
        }, 100)
    }

    /**
     * 타이머 종료
     * @public
     */
    stop() {
        clearInterval(this.#player)
    }

    init() {
        Object.keys(this).forEach((method) => {
            if (typeof this[method] === 'function') {
                this[method] = this[method].bind(this)
            }
        })

        Object.keys(callbacks).forEach((key) => {
            this.#callbackMap.set(key, () => {
                const errMsg = callbacks[key]

                if (errMsg) {
                    this.log(errMsg)
                }
            })
        })
    }

    /**
     * 옵션 설정
     * @param { ticketingOptions } [options]
     */
    setOptions(options = {}) {
        if (Object.keys(options).length) {
            Object.assign(this.#options, options)
        }
    }

    /**
     * @private
     */
    timeupdate() {
        const serverTime = Date.now()
        const endTime = this.#input
        const remainTime = endTime - serverTime

        if (remainTime <= 0) {
            this.complete()
            return
        }

        let ms = remainTime % 1000
        let s = Math.floor(remainTime / 1000)
        let m = 0
        if (s > 60) {
            m = Math.floor(s / 60)
            s = s % 60
        }
        this.log(timestamp`${m}:${s}:${ms}`)
    }

    complete() {
        clearInterval(this.#player)

        if (this.#callback) {
            this.#callback()
            return
        }

        this.log('종료되었습니다.')
    }
    log(...msgs) {
        const onLogging = this.#options?.onLogging

        if (typeof onLogging === 'function') {
            this.#options.onLogging(...msgs)
            return
        }

        this.#log(...msgs)
    }
}

export default TicketingTimer
