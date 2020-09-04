export default () => {
    const goPage = window?.goPage

    if (typeof goPage !== 'function') {
        return 'goPage 메서드가 존재하지 않습니다.'
    }

    goPage(1)

    return null
}
