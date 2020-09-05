import { applyCodeHighlight } from '@/plugins/highlight.module'

self.addEventListener('message', function (event) {
    const code = event.data || ''

    self.postMessage(applyCodeHighlight(code))
})
