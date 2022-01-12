# README

![Auto Release](https://github.com/divlook/ticketing-timer/workflows/Auto%20Release/badge.svg)
![Create Pages](https://github.com/divlook/ticketing-timer/workflows/Create%20Pages/badge.svg)

티켓팅(KTX, SRT, 기타)을 위한 크롬 확장 앱입니다.

KTX 또는 SRT의 홈페이지에 접속 후 타이머를 실행하면, 예약된 시간에 자동으로 명절 승차권 예약하기 버튼을 클릭합니다.

## 지원 사이트

### KTX

- URL : http://www.letskorail.com/
- 확인 일자 : 2022-01-12

### SRT

- URL : https://etk.srail.kr/
- 확인 일자 : 2018-01-17

## 사용 방법

### Chrome 확장 프로그램

Chrome 브라우저의 확장 앱입니다. 아직 미완성이라 사용이 불편하실 수 있습니다.

앱 버전 v1.4.2 이상을 사용하셔야 됩니다. 이전 버전은 정상적으로 동작하지 않습니다.

- 설치 : [Chrome 웹 스토어](https://chrome.google.com/webstore/detail/ticketing-timer/aglloefolpfdegbjigcdabgjonfdcmlh)에서 `Chrome에 추가` 버튼을 클릭합니다.
- 티켓팅할 사이트에 접속합니다.
- 툴바에 해당 앱의 아이콘을 클릭하면 타이머가 나타납니다.
- 날짜와 시간을 입력합니다.
- 타이머 종료 후 실행할 코드를 입력합니다. (추후 코드를 직접 입력하지 않고 자동으로 생성되게 변경될 예정입니다. 기능 추가 후 코드 입력 창은 없어지거나 기능이 축소될 예정입니다.)
- 기다립니다.

> Chrome 웹 스토어 : https://bit.ly/3hjbElk

### Chrome Console

Chrome 브라우저의 콘솔에 코드를 직접 입력해서 실행하는 방법입니다.

1. Chrome 브라우저 실행. (또는 IE를 제외한 최신 버전의 브라우저)
2. 티켓팅 사이트 접속.
3. 개발자 도구 실행
   - Window: F12
   - OSX: ⌥ + ⌘ + i (option + command + i)
4. [소스(dist/ticketing-timer.script.js)](./dist/ticketing-timer.script.js)를 복사하여 Console 탭에 붙여넣고 `Enter`
5. [#예제](#예제) 소스를 복사하여 Console 탭에 붙여넣기
6. `type`과 `datetime` 수정 후 `Enter`

## 주의 사항

티켓팅 사이트가 업데이트 되어 이 소스가 동작하지 않을 수 있습니다.

실제로 사용하기 전에 반드시 동작 여부를 테스트해주세요.

## Docs

```js
new TicketingTimer(typeOrCallback[, ticketingOptions])
```

### 예제

#### KTX 예매

```js
const timer = new TicketingTimer('ktx')
timer.start('2020-09-08 07:00:00') // 날짜 입력
```

#### 커스텀

```js
const timer = new TicketingTimer(() => {
    console.log('여기에 커스텀 코드 추가')
})
timer.start('2020-09-08 07:00:00') // 날짜 입력
```

### 변수

| 이름 | 타입 | 설명 |
| - | - | - |
| TicketingType | 'ktx' \| 'srt' | 제공되는 티켓팅 사이트의 `type` |
| Callback | () => void | |
| typeOrCallback | TicketingType \| Callback | |
| ticketingOptions | object | [옵션](#옵션) 참고 |
| datetime | string | YYYY-MM-DD HH:mm:ss (ex '2020-09-08 07:00:00') |

### Methods

#### start

타이머를 실행합니다.

```js
timer.start(datetime)
```

#### stop

타이머를 종료합니다.

```js
timer.stop()
```

### 옵션

#### onInit

인스턴스가 생성되었을 때

```js
new TicketingTimer(typeOrCallback, {
    onInit: function() {
        console.log('on init')
    },
})
```

#### onReject

실행이 거부되었을 때

```js
new TicketingTimer(typeOrCallback, {
    onReject: function() {
        console.log('on reject')
    },
})
```

#### onStart

실행이 시작 되었을 때

```js
new TicketingTimer(typeOrCallback, {
    onStart: function() {
        console.log('on start')
    },
})
```

#### onStop

실행이 종료 되었을 때

```js
new TicketingTimer(typeOrCallback, {
    onStop: function() {
        console.log('on stop')
    },
})
```

#### onTimeupdate

시간이 업데이트 되었을 때

```js
new TicketingTimer(typeOrCallback, {
    onTimeupdate: function() {
        console.log('on timeupdate')
    },
})
```

#### onComplete

실행이 완료 되었을 때

```js
new TicketingTimer(typeOrCallback, {
    onComplete: function() {
        console.log('on complete')
    },
})
```

#### onLogging

로그가 전달 되었을 때

```js
new TicketingTimer(typeOrCallback, {
    onLogging: function(...msg) {
        console.log('onLogging : ', ...msg)
    },
})
```
