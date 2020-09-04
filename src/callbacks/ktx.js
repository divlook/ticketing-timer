export default () => {
    const NetFunnel = window?.NetFunnel
    const NetFunnel_goAliveNotice = NetFunnel?.NetFunnel_goAliveNotice

    if (typeof NetFunnel_goAliveNotice !== 'function') {
        return 'NetFunnel.NetFunnel_goAliveNotice 메서드가 존재하지 않습니다.'
    }

    NetFunnel_goAliveNotice(1)

    return null
}
