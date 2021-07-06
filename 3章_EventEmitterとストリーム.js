const { fstat } = require('fs')
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
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    this.emit('end')
  }
}

new createFizzBuzzEventEmitter()
  .on('start', startListener)
  .on('Fizz', fizzListener)
  .on('Buzz', buzzListener)
  .on('FizzBuzz', fizzBuzzListener)
  .on('end', endListener)
  .start(20)

// 3.1.5 コールバックパターン形式でイベントリスナを登録する
const http = require('http')
const { Stream } = require('stream')

// サーバオブジェクトの生成
const server = http.createServer()

// requestイベントのリスナ登録
server.on('request', (req, res) => {
  // クライアントからのリクエストに対する処理
})

// ポートの監視およびlisteningイベントのリスナ登録
server.listen(8000, () => {
  // ポートの待機を開始した際の処理
})

// 3.1.6 EventEmitterからのasyncイテラブルの生成

const eventAEmitter = new events.EventEmitter()

const eventAIterable = events.on(eventAEmitter, 'eventA')

eventAEmitter.listeners('eventA')

  (async () => {
    for await (const a of eventAIterable) {
      if (a[0] === 'end') {
      // endが渡されたらループを抜ける
        break
      }
      console.log('eventA', a)
  }
  })()

eventAEmitter.emit('eventA', 'Hello')

eventAEmitter.emit('eventA', 'Hello', 'World')

eventAEmitter.emit('eventA', 'end')

eventAEmitter.listeners('eventA')

// 3.1.7 EventEmitterのPromise化
const eventBEmitter = new events.EventEmitter()

const eventBPromise = events.once(eventBEmitter, 'eventB')

eventBPromise.then(arg => console.log('eventB発生', arg))

eventBEmitter.emit('eventB', 'Hello', 'World')

// 一度でもeventBが発行されたらeventBPromiseはfulfilledになるため、以降のイベント発行には反応しません。
eventBEmitter.emit('eventB', 'one more')

// 3.2 ストリーム

function copyFile(src, dest, cb) {
  // ファイルの読み込み
  fs.readFile(src, (err, data) => {
    if (err) {
      return cb(err)
    }
    // 読み込んだ内容を別のファイルに書き出す
    fs.writeFile(dest, data, cb)
  })
}

// 3.2.1 ストリームの基本
function copyFileWithStream(src, dest, cb) {
  // ファイルから読み込みストリームを生成
  fs.createReadStream(src)
  // ファイルから書き込みストリームを生成し、pipe()でつなぐ
    .pipe(fs.createWriteStream(dest))
  // 完了時にコールバックを呼び出す
  .on('finish', cb)
}

// コピー元ファイルの生成
fs.writeFileSync('src.txt', 'Hello, World!')

// コピー実行
copyFileWithStream('src.txt', 'dest.txt', () => console.log('コピー完了'))

// 3.2.2 読み込みストリーム
const readStream = fs.createReadStream('src.txt')
readStream
// readableイベントリスナの登録
  .on('readable', () => {
    console.log('readable')
    let chunk
    // 現在読み込み可能なデータをすべて読み込む
    while ((chunk = readStream.read()) !== null) {
      console.log(`chunk: ${chunk.toString()}`)
    }
  })
// endイベントリスナの登録
  .on('end', () => console.log('end'))

class HelloReadableStream extends Stream.Readable {
  constructor(options) {
    super(options)
    this.languages = ['JavaScript', 'Python', 'Java', 'C#']
  }

  _read(size) {
    console.log('_read()')
    let language
    while ((language = this.languages.shift())) {
      // push()でデータを流す
      // ただし、push()がfalseを返したらそれ以上流さない
      if (!this.push(`Hello, ${language}!\n`)) {
        console.log('読み込み中断')
        return
      }
    }
    // 最後にnullを流してストリームの終了を通知する
    console.log('読み込み完了')
    this.push(null)
  }
}

// では、この読み込みストリームからデータを読み込んでみましょう。

const helloReadableStream = new HelloReadableStream()
helloReadableStream.on('readable', () => {
  console.log('readable')
  let chunk
  while ((chunk = helloReadableStream.read()) !== null) {
    console.log(`chunk: ${chunk.toString()}`)
  }
})
  .on('end', () => console.log('end'))

// メソッドを使って、ファイルへの書き込みを試してみましょう。

const fileWriteStream = fs.createWriteStream('dest.txt')

fileWriteStream.write('Hello\n')
fileWriteStream.write('Hello\n')
fileWriteStream.end()
fs.readFileSync('dest.txt', 'utf8')

// 書き込みストリームなので、実装すべきメソッドは_read()ではなく_write()です。
class DelayLogStream extends Stream.Writable {
  constructor(options){
  // objectMode: trueを指定するとオブジェクトをデータとして流せる
  super({ objectMode: true, ...options })
  }
  _write(chunk, encoding, callback) {
    console.log('_write()')
    // messageプロパティ(文字列), delayプロパティ(数値)を含むオブジェクトが
    // データとして流れてくることを期待
    const { message, delay } = chunk
    // delayで指定した時間(ミリ秒)だけ遅れてmessageをログに出す
    setTimeout(() => {
      console.log(message)
      callback()
    }, delay)
  }
}

const delayLogStream = new DelayLogStream()

delayLogStream.write({ message: 'Hi', delay: 0 })
delayLogStream.write({ message: 'Thank you', delay: 1000 })
delayLogStream.end({ message: 'Bye', delay: 100 })

// 3.2.4 二重ストリームと変換ストリーム

// 文字列データを行単位でDelayLogStreamが受け取れる形式のオブジェクトに変換する
// 変換ストリームを作ってみましょう。

class LineTransformStream extends Stream.Transform {
  // 上流から受け取ったデータの内、下流に流していない分を保持するフィールド
  remaining = ''
  construncto(options) {
    // push()にオブジェクトを渡せるようにする
    super({ readableObjectMode: true, ...options })
  }

  _transform(chunk, encoding, callback) {
    console.log('_transform()')
    const lines = (chunk + this.remaining).split(/\n/)
    // 最後の行は次に入ってくるデータの先頭と同じ行になるため、変数に保持
    this.remaining = lines.pop()
    for (const line of lines) {
      // ここではpush()の戻り値は気にしない
      this.push({ message: line, delay: line.length * 100 })
    }
    callback()
  }

  _flush(callback) {
    console.log('_flush()')
    // 残っているデータを流し切る
    this.push({
      message: this.remaining,
      delay: this.remaining.length * 100
    })
    callback()
  }
}

const lineTransformStream = newLineTransformStream()
lineTransformStream.on('readable', () => {
  let chunk
  while ((chunk = lineTransformStream.read()) !== null) {
    console.log(chunk)
  }
})

lineTransformStream.write('foo\nbar')

lineTransformStream.write('baz')

lineTransformStream.end()

// 3.2.5 pipe()によるストリームの連結
new HelloReadableStream()
  .pipe(new LineTransformStream())
  .pipe(new DelayLogStream())
  .on('finish', () => console.log('完了'))


new HelloReadableStream({ highWaterMark: 0 })
  .pipe(new LineTransformStream({
  // 二重ストリームのhighWaterMarkはwriteとreadでそれぞれ指定が必要
    writableHighWaterMark: 0,
    readableHighWaterMark: 0
  }))
  .pipe(new DelayLogStream({ highWaterMark: 0 }))
  .on('finish', () => console.log('完了'))

const ltStream = new LineTransformStream()

ltStream === new HelloReadableStream().pipe(ltStream)

const srcReadStream = fs.createReadStream('src.txt')

srcReadStream
  .pipe(fs.createWriteStream('dest.txt'))
  .on('finish', () => console.log('分岐1完了'))

srcReadStream
  .pipe(crypto.createHash('sha256'))
  .pipe(fs.createWriteStream('dest.crypto.txt'))
  .on('finish', () => console.log('分岐2完了'))

// 3.2.6 エラーハンドリングとstream.pipeline()

fs.createReadStream('no-such-file.txt')
  .pipe(fs.createWriteStream('dest.txt'))
  .on('error', err => console.log('エラーイベント', err.message))

fs.createReadStream('no-such-file.txt')
  .on('error', err => console.log('エラーイベント', err.message))
  .pipe(fs.createWriteStream('dest.txt'))
  .on('error', err => console.log('エラーイベント', err.message))

Stream.pipeline(
  // pipe()したい2つ以上のストリーム
  fs.createReadStream('no-such-file.txt'),
  fs.createWriteStream('dest.txt'),
  // コールバック
  err => err
    ? console.error('エラー発生', err.message)
    : console.log('正常終了')
)