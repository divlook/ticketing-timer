/**
 * @param { HTMLElement } el
 */
export function empty(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild)
    }
}

/**
 * @param { HTMLElement } el
 * @param { HTMLElement } child
 */
export function add(el, child) {
    el.appendChild(child)
}

export function renderTemplate(template = '<div></div>') {
    const container = document.createElement('div')
    container.innerHTML = template
    return container.children[0]
}

/**
 * article 생성
 * @param { string } text
 * @param { (article: HTMLElement) => void } [onSuccess]
 */
export function createArticle(text = '', onSuccess = null) {
    if (!text) {
        return null
    }

    const article = document.createElement('article')
    article.innerText = text

    if (typeof onSuccess === 'function') {
        onSuccess(article)
    }

    return article
}

/**
 * 위치 지정 요소 가져오기
 * @description `position`이 'static'이 아닌 요소, 즉 'relative', 'absolute', 'fixed', 'sticky'
 * @param { HTMLElement } el
 */
export function getBestZIndexAmongChild(el) {
    const children = Array.from(el.children)
    const que = []
    let bestZIndex = 0

    children.forEach((child) => {
        if (child.classList.contains('ticketing-timer-app')) {
            return
        }

        const _child = parseElement(child)
        const zIndex = parseInt(_child.style.zIndex)

        if (_child.style.position === 'static') {
            que.push(
                getBestZIndexAmongChild(child).then((childZIndex) => {
                    if (childZIndex > bestZIndex) {
                        bestZIndex = childZIndex
                    }
                })
            )
        }

        if (isNaN(zIndex)) {
            return
        }

        if (zIndex > bestZIndex) {
            bestZIndex = zIndex
        }
    })

    return Promise.all(que).then(() => bestZIndex)

    /**
     * @param { HTMLElement } el
     */
    function parseElement(el) {
        const style = window.getComputedStyle(el)

        return {
            el,
            style: {
                zIndex: style.zIndex,
                position: style.position,
            },
        }
    }
}
