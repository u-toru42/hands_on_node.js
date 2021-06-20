function parseJSONSync(json) {
  try {
    return JSON.parse(json);
  } catch (err) {
    console.error('エラーをキャッチ', err);
  }
}
parseJSONSync('不正なJSON');

function parseJSONAsync(json, callback) {
  try {
    setTimeout(() => {
      callback(JSON.parse(json));
    }, 1000);
  } catch (err) {
    console.log('エラーをキャッチ', err);
    callback({});
  }
}
parseJSONAsync('不正なJSON',
  result => console.log('parse結果', result)
);

process.on('uncaughtException', err => {
  process.exit(1)
})

// parseJSONAsync()をNode.jsの規約に沿って書き直すと次のようになる
function parseJSONAsync(json, callback) {
  setTimeout(() => {
    try {
      callback(null, JSON.parse(json))
    } catch (err) {
      callback(err)
    }
  }, 1000)
}
parseJSONAsync('不正なJSON',
  (err, result) => console.log('parse結果', err, result)
)

// 2.2.3混ぜるな危険、同期と非同期
const cache = {}