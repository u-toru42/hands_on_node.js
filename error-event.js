const events = require('events')

try {
  new events.EventEmitter()
  // 'event'イベントリスナの登録をコメントアウト
  // .on('error', err => console.log('errorイベント))
  .emit('error', new Error('エラー'))
} catch (err) {
  console.log('catch')
}