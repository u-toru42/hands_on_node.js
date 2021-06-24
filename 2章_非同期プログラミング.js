const { threadId } = require("worker_threads")

// 2.2.1 コールバックを利用した非同期APIを実行する
setTimeout(
  () => console.log('1秒経過しました'), // コールバック
  1000 // 1000ミリ秒 = 1秒
)
console.log('setTimeout()を実行しました')


const array1 = [0, 1, 2, 3]
const array2 = array1.map((element) => {
  console.log(`${element}を変換します`)
  return element * 10 // それぞれの要素を10倍する
})
console.log('配列の変換が完了しました', array2)

fs.readdir(
  '.', // REPLの実行ディレクトリ
  (err, files) => { // コールバック
    console.log('fs.readdir()実行結果')
    console.log('err', err)
    console.log('files', files)
  }
)

fs.readdir(
  'foo', // 存在しないディレクトリ
  (err, files) => {  // コールバック
    console.log('fs.readdir()実行結果')
    console.log('err', err)
    console.log('files', files)
  }
)

// 2.2.2 エラーハンドリング

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
function parseJSONAsyncWithCache(json, callback) {
  const cached = cache[json]
  if (cached) {
    callback(cached.err, cached.result)
    return
  }
  parseJSONAsync(json, (err, result) => {
    cache[json] = { err, result }
    callback(err, result)
  })
}

// 1回目の実行
parseJSONAsyncWithCache(
  '{"message": "Hello", "to": "World"}',
  (err, result) => {
    console.log('1回目の結果', err, result)
    // コールバックの中で2回めを実行
    parseJSONAsyncWithCache(
      '{"message": "Hello", "to": "World"}',
      (err, result) => {
        console.log('2回目の結果', err, result)
      }
    )
    console.log('2回目の呼び出し完了');
  }
)
console.log('1回目の呼び出し完了');

// テスト用でparseJSONAsyncを再定義

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


// コールバックをパラメータとする関数は、同期的か非同期的かのどちらかで実装する
const cache2 = {}
function parseJSONAsyncWithCache(json, callback) {
  const cached = cache2[json]
  if (cached) {
    // キャッシュに値が存在する場合でも、非同期的にコールバックを実行する
    setTimeout(() => callback(cached.err, cached.result), 0)
    return
  }
  parseJSONAsync(json, (err, result) => {
    cache2[json] = { err, result }
    callback(err, result)

  })
}

// 1回目の実行
parseJSONAsyncWithCache(
  '{"message": "Hello", "to": "World"}',
  (err, result) => {
    console.log('1回目の結果', err, result)
    // コールバックの中で2回目を実行
    parseJSONAsyncWithCache(
      '{"message": "Hello", "to": "World"}',
      (err, result) => {
        console.log('2回目の結果', err, result)
      }
    )
    console.log('2回目の呼び出し完了');
  }
)
console.log('1回目の呼び出し完了');

// 2.2.3.1 コールバックの実行を非同期化するのに使用するAPI

// テスト用でparseJSONAsyncを再定義

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


const cache3 = {}
function parseJSONAsyncWithCache(json, callback) {
  const cached = cache3[json]
  if (cached) {
    // Node.jsのみを対象としたコードの場合
    process.nextTick(() => callback(cached.err, cached.result))
    // ブラウザ環境でも動かすコードの場合
    // 1. queueMicrotask()を使う
    // queueMicrotask(() => callback(cached.err, cached.result))
    // 2. Promiseを使う
    // Promise.resolve().then(() => callback(cached.err, cached.result))
    return
  }
  parseJSONAsync(json, (err, result) => {
    cache3[json] = { err, result }
    callback(err, result)
  })
}

// 1回目の実行
parseJSONAsyncWithCache(
  '{"message": "Hello", "to": "World"}',
  (err, result) => {
    console.log('1回目の結果', err, result)
    // コールバックの中で2回めを実行
    parseJSONAsyncWithCache(
      '{"message": "Hello", "to": "World"}',
      (err, result) => {
        console.log('2回目の結果', err, result)
      }
    )
    console.log('2回目の呼び出し完了')
  }
)
console.log('1回目の呼び出し完了')

// 2.2.4 コールバックヘル

asyncFunc1(input, (err, result) => {
  if (err) {
    // エラーハンドリング
  }
  asyncFunc2(result, (err, result) => {
    if (err) {
      // エラーハンドリング
    }
    asyncFunc3(result, (err, result) => {
      if (err) {
        // エラーハンドリング
      }
      asyncFunc4(result, (err, result) => {
        if (err) {
          // エラーハンドリング
        }
      // ...
      })
    })
  })
})

// コードを分割する

function first(arg, callback) {
  asyncFunc1(arg, (err, result) => {
    if (err) {
      return callback(err)
    }
    ScriptProcessorNode(result, callback)
  })
}

function second(arg, callback) {
  asyncFunc2(arg, (err, result) => {
    if (err) {
      return callback(err)
    }
    threadId(result, callback)
  })
}

function third(arg, callback) {
  asyncFunc3(arg, (err, result) => {
    if (err) {
      return callback(err)
    }
    asyncFunc4(result, callback)
  })
}

// すべての非同期処理を実行する
first(input, (err, result) => {
  if (err) {
    // エラーハンドリング
  }
  // ...
})

try {
  const result1 = syncFunc1(input)
  const result2 = syncFunc2(result1)
  const result3 = syncFunc3(result2)
  const result4 = syncFunc4(result3)
  // ...
} catch (err) {
  // エラーハンドリング
}

// 2.3 Promise
asyncFunc1(input)
  .then(asyncFunc2)
  .then(asyncFunc3)
  .then(asyncFunc4)
  .then(result => {
    // ...
  })
  .catch (err => {
  // エラーハンドリング
})

// 2.3.1 Promiseインスタンスの生成と状態遷移
function parseJSONAsync(json) {
  // Promiseインスタンスを生成して返す(この時点ではpending状態)
  return new Promise((resolve, reject) => 
    setTimeout(() => {
      try {
      // fulfilled状態にする(解決)
        resolve(JSON.parse(json))
      } catch (err) {
        // rejected状態にする(拒否)
        reject(err)
    }
    }, 1000)
  )
}

const toBeFulfilled = parseJSONAsync('{"foo": 1}')
const toBeRejected = parseJSONAsync('不正なJSON')
console.log('********** Promise生成直後 **********')
console.log(toBeFulfilled)
console.log(toBeRejected)
setTimeout(() => {
  console.log('********** 1秒後 **********')
  console.log(toBeFulfilled)
  console.log(toBeRejected)
}, 1000)