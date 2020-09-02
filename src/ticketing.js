import logger from '@/utils/logger'
import { timestamp } from '@/utils'

/**
 * @typedef { 'ktx' | 'srt' } TicketingType
 */

/**
 * console.log
 */
const log = logger()
log.clear = true

/**
 * Ticketing
 *
 * @example
 * const ticketing = new Ticketing('ktx')
 * ticketing.start('2020-09-02 12:21:00')
 */
class Ticketing {
    #input = 0
    #player
    #callback
    /**
     * @type { Map<TicketingType, () => void> }
     */
    #callbackMap = new Map()

    /**
     * @param { TicketingType | (() => void) } typeOrCallback
     * 타이머 종료 후 실행할 `callback` 또는 `type`. `type` 입력시 해당 `callback` 실행
     */
    constructor(typeOrCallback) {
        this.init()

        if (typeof typeOrCallback === 'function') {
            this.#callback = typeOrCallback
            return
        }

        if (this.#callbackMap.has(typeOrCallback)) {
            this.#callback = this.#callbackMap.get(typeOrCallback)
            return
        }

        log.notice = 'callback이 없습니다.'
    }

    /**
     * 타이머 시작
     * @public
     * @param { string } datetime YYYY-MM-DD HH:mm:ss (ex '2020-09-02 12:21:00')
     */
    start(datetime) {
        this.stop()

        if (!datetime) {
            log('날짜 및 시간을 입력해주세요.')
            return
        }

        this.#input = new Date(datetime).getTime()
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

        this.#callbackMap.set('ktx', () => {
            if (
                typeof window?.['NetFunnel']?.['NetFunnel_goAliveNotice'] !==
                'function'
            ) {
                log(
                    'NetFunnel.NetFunnel_goAliveNotice 메서드가 존재하지 않습니다.'
                )
                return
            }

            window['NetFunnel']['NetFunnel_goAliveNotice'](1)
        })

        this.#callbackMap.set('srt', () => {
            if (typeof window?.['goPage'] !== 'function') {
                log('goPage 메서드가 존재하지 않습니다.')
                return
            }

            window['goPage'](1)
        })
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
        log(timestamp`${m}:${s}:${ms}`)
    }

    complete() {
        clearInterval(this.#player)

        if (this.#callback) {
            this.#callback()
            return
        }

        log('종료되었습니다.')
    }
}

export default Ticketing
