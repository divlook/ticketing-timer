/**
 * Logger
 *
 * @example
 * const log = logger()
 * log('This log') // 'This log'
 *
 * // Use Notice
 * log.notice = 'Notice'
 * log('This log')
 * > 'Notice'
 * > 'This log'
 *
 * // Use console.clear()
 * log.clear = true
 * log('This log')
 * > Console was cleared
 * > 'This log'
 */
function logger() {
    let notice = ''
    let clear = false

    function log(...logs) {
        clear && console.clear()
        notice && console.log(notice)
        console.log(...logs)
    }

    Object.defineProperty(log, 'notice', {
        set(nextNotice) {
            if (nextNotice) {
                notice = nextNotice
            }
        },
    })
    /**
     * Notice
     * @public
     */
    log.notice = ''

    Object.defineProperty(log, 'clear', {
        get() {
            return clear
        },
        set(useClear) {
            clear = !!useClear
        },
    })
    /**
     * Use console.clear()
     * @public
     */
    log.clear = false

    return log
}

export default logger
