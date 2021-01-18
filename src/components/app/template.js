function template() {
    return `
        <div class="ticketing-timer-app">
            <div class="tta-container">
                <header>
                    <h3>${TITLE}</h3>

                    <p>날짜와 시간을 입력 해주세요</p>

                    <form>
                        <p class="tta-input-container">
                            <input type="date" data-id="date">
                            <input type="time" data-id="time" step="1">
                        </p>

                        <p>
                            <select data-id="ticketing-type">
                                <option value="custom">Custom</option>
                                <option value="ktx">KTX</option>
                                <option value="srt">SRT</option>
                            </select>
                        </p>

                        <div class="tta-editor-container">
                            <textarea rows="10" data-id="editor" placeholder="여기에 코드를 입력해주세요."></textarea>
                            <code data-id="editor-preview" class="hljs javascript"></code>
                        </div>

                        <p class="text-right">
                            <button type="button" data-id="hide">닫기</button>
                            <button type="reset" data-id="reset">초기화</button>
                            <button type="button" data-id="cancel">취소</button>
                            <button type="submit" data-id="submit">실행</button>
                        </p>
                    </form>
                </header>

                <div class="tta-console"></div>
            </div>

            <div class="tta-modal-backdrop"></div>
        </div>
    `
}

export default template
