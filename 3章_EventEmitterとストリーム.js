const http = require('http')

// サーバオブジェクト(EventEmitterのインスタンス)の生成
const server = http.createServer()

// requestイベントのリスナ登録
server.on('request', (req, res) => {
  // レスポンスを返す
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.write('Hello, World!')
  res.end()
})

// listening(リクエストの受付開始)イベントのリスナ登録
server.on('listening', () => {
  // ...
})

// errorイベントのリスナ登録
server.on('error', err => {
  // ...
})

// clone(リクエストの受付終了)イベントのリスナ登録
server.on('clone', () => {
  // ...
})

// サーバの起動
server.listen(8000)

// 3.1.1 EventEmitterの利用

// EventEmitterのインスタンスの生成
const eventEmitter = new events.EventEmitter()

// fizbuzz, 注意:この実装には一部問題があります。
function createFizzBuzzEventEmitter(until) {
  const eventEmitter = new events.EventEmitter()
  _emitFizzBuzz(eventEmitetr, until)
  return eventEmitter
}

// async/await構文が使えるよう、イベントを発行する部分を別の関数に切り離す
async function _emitFizzBuzz(eventEmitter, until) {
  eventEmitter.emit('start')
  let count = 1
  while (count <= until) {
    await new Promise(resolve => setTimeout(resolve, 100))
    if (count % 15 === 0) {
      eventEmitter.emit('FizzBuzz', count)
    } else if (count % 3 === 0) {
      eventEmitter.emit('Fizz', count)
    } else if (count % 5 === 0) {
      eventEmitter.emit('Buzz', count)
    }
    count += 1
  }
  eventEmitter.emit('end')
}

// ひとまず上記の関数の作るEventEmitterインスタンスが発行するイベントをハンドリングする処理を書いてみましょう
function startListener() {
  console.log('start')
}
function fizzListener(count) {
  console.log('Fizz', count)
}
function buzzListener(count) {
  console.log('Buzz', count)
}
function fizzBuzzListener(count) {
  console.log('FizzBuzz', count)
}
function endListener() {
  console.log('end')
  this // thisはEventEmitterインスタンス
  // 全てのイベントからリスナを削除する
    .off('start', startListener)
    .off('Fizz', fizzListener)
    .off('Buzz', buzzListener)
    .off('FizzBuzz', fizzBuzzListener)
    .off('end', endListener)
}

createFizzBuzzEventEmitter(40)
  .on('start', startListener)
  .on('Fizz', fizzListener)
  .once('Buzz', buzzLister) // Buzzイベントだけonceで登録
  .on('FizzBuzz', fizzBuzzListener)
  .on('end', endListener)

createFizzBuzzEventEmitter(0)
  .on('start', startListener)
  .on('end', endListener)


// EventEmitterの注意すべき点、リスナが常に同期的に実行される
const fooEventEmitter = new events.EventEmitter()
fooEventEmitter.on('foo', () => {
  console.log('fooイベントリスナの実行')
})
console.log('fooイベント実行', fooEventEmitter.emit('foo'))

// 3.1.2 EventEmitterとメモリリーク

const barEventEmitter = new events.EventEmitter()
for (let i = 0; i < 11; i++) {
  barEventEmitter.on('bar', () => console.log('bar'))
}

const messageEventEmitter = new events.EventEmitter()

{
  // ブロック内での変数(listener)の宣言
  const listener = () => console.log('Hello')
  messageEventEmitter.on('message', listener)
}

// listeners()メソッドでmessageイベントのリスナを取得
messageEventEmitter.listeners('message')

// デフォルトリスナ数10を増やすにはsetMaxListeners()
const bazEventEmitter = new events.EventEmitter()
// リスナを100個まで登録できるようにする
bazEventEmitter.setMaxListeners(100)
for (let i = 0; i < 100; i++) {
  bazEventEmitter.on('baz', () => console.log('baz'))
}

// 3.1.3 エラーハンドリング
// error-event.jsを作成

// 3.1.4 EventEmitterの継承
class createFizzBuzzEventEmitter extends event.EventEmitter {
  async start(until) {
    this.emit('start')
    let count = 1
    while (true) {
      if (count % 15 === 0) {
        this.emit('FizzBuzz', count)
      } else if (count % 3 === 0) {
        this.emit('Fizz', count)
      } else if (count % 5 === 0) {
        this.emit('Buzz', count)
      }
      count += 1
      if (count >= until) {
        break
      }
    }
  }
}

// イベントハンドリング
function startListener() {
  console.log('start')
}
function fizzListener(count) {
  console.log('Fizz', count)
}
function buzzListener(count) {
  console.log('Buzz', count)
}
function fizzBuzzListener(count) {
  console.log('FizzBuzz', count)
}
function endListener() {
  console.log('end')
  this // thisはEventEmitterインスタンス
  // 全てのイベントからリスナを削除する
    .off('start', startListener)
    .off('Fizz', fizzListener)
    .off('Buzz', buzzListener)
    .off('FizzBuzz', fizzBuzzListener)
    .off('end', endListener)
}

createFizzBuzzEventEmitter(40)
    .on('start', startListener)
    .on('Fizz', fizzListener)
    .on('Buzz', buzzListener)
    .on('FizzBuzz', fizzBuzzListener)
    .on('end', endListener)

// リスナが実行されない
createFizzBuzzEventEmitter(0)
  .on('start', startListener)
  .on('end', endListener)