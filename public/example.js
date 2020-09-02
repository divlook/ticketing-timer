document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.Ticketing === 'undefined') {
        console.error('Ticketing 모듈이 선언되지 않았습니다.')
        return
    }

    console.log('Ticketing 모듈이 로드되었습니다.')

    const ticketing = new Ticketing(() => {
        console.log('끝!')
    })
    // const ticketing = new Ticketing('ktx')
    // const ticketing = new Ticketing('srt')

    ticketing.start('2020-09-02 12:21:00')
})
