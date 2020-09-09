function template() {
    return `
        <div class="ticketing-timer-app">
            <header>
                <h3>${TITLE}</h3>

                <p>날짜와 시간을 입력 해주세요</p>

                <form>
                    <p class="input-container">
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

                    <div class="editor-container">
                        <textarea rows="10" data-id="editor"></textarea>
                        <code data-id="editor-preview" class="hljs javascript"></code>
                    </div>

                    <p class="text-right">
                        <button type="reset" data-id="reset">초기화</button>
                        <button type="button" data-id="cancel">취소</button>
                        <button type="submit" data-id="submit">실행</button>
                    </p>
                </form>
            </header>

            <section class="console"></section>
        </div>
    `
}

export default template
