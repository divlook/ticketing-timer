# README

![Auto Release](https://github.com/divlook/ticketing/workflows/Auto%20Release/badge.svg)

티켓팅을 위한 모듈입니다.

## 지원 사이트

### KTX

- URL : http://www.letskorail.com/
- 확인 일자 : 2020-01-08

### SRT

- URL : https://etk.srail.kr/
- 확인 일자 : 2018-01-17

## 사용 방법

1. Chrome 브라우저 실행. (또는 IE를 제외한 최신 버전의 브라우저)
2. 티켓팅 사이트 접속.
3. 개발자 도구 실행
   - Window: F12
   - OSX: ⌥ + ⌘ + i (option + command + i)
4. [소스](./dist/ticketing.js)를 복사하여 Console 탭에 붙여넣고 `Enter`
5. [예제](#예제) 소스를 복사하여 Console 탭에 붙여넣기
6. `type`과 `datetime` 수정 후 `Enter`

## 주의 사항

티켓팅 사이트가 업데이트 되어 이 소스가 동작하지 않을 수 있습니다.

반드시 사용 전에 테스트해주세요.

## Docs

```js
new Ticketing(typeOrCallback)
```

### 예제

#### KTX 예매

```js
const ticketing = new Ticketing('ktx')
ticketing.start('2020-09-08 07:00:00') // 날짜 입력
```

#### 커스텀

```js
const ticketing = new Ticketing(() => {
    console.log('여기에 커스텀 코드 추가')
})
ticketing.start('2020-09-08 07:00:00') // 날짜 입력
```

### 변수

| 이름 | 타입 | 설명 |
| - | - | - |
| TicketingType | 'ktx' \| 'srt' | 제공되는 티켓팅 사이트의 `type` |
| Callback | () => void | |
| typeOrCallback | TicketingType \| Callback | |
| datetime | string | YYYY-MM-DD HH:mm:ss (ex '2020-09-08 07:00:00') |

### Methods

#### start

타이머를 실행합니다.

```js
ticketing.start(datetime)
```

#### stop

타이머를 종료합니다.

```js
ticketing.stop()
```
