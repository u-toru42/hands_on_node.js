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
// 駄目な例
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

// 良い例
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

process.on(
  'unhandledRejection',
  (
    err, // Promiseの拒否理由
    promise // 放置されたrejectedなPromise
  ) => {
    // unhandleRejection発生の原因を調べられるよう、ログ出力などの対応を行う
    console.log('unhandleRejection発生', err)
  }
)

// コンストラクタを使ってfulfilledなPromiseインスタンスを生成
new Promise(resolve => resolve({ foo: 1 }))
// Promise.resolve()を使ってfulfilledなPromiseインスタンスを生成
Promise.resolve({ foo: 1 })
// コンストラクタを使ってrejectedなPromiseインスタンスを生成
new Promise((resolve, reject) => reject(new Error('エラー')))
// Promise.reject()を使ってrejectedなPromiseインスタンスを生成
Promise.reject(new Error('エラー'))

//　Promise.resolve()の引数にPromiseインスタンスを渡した場合は、引数がそのまま返されます。
const fooPromise = Promise.resolve('foo')
fooPromise === Promise.resolve(fooPromise)

// 2.3.2.1 then()
promise.then(
  // onFulfilled
  value => {
    // 成功時の処理
  },
  // onRejected
  err => {
    // 失敗時の処理
  }
)

// stringで解決されるPromiseインスタンスの生成

const stringPromise = Promise.resolve('{"foo": 1}')
stringPromise

// numberで解決される新しいPromiseインスタンスの生成(onRejected()を省略)
const numberPromise = stringPromise.then(str => str.length)

numberPromise

// then()を実行しても元のPromiseインスタンスの状態は変わらない
stringPromise

const unrecoveredPromise = Promise.reject(new Error('エラー')).then(() => 1)

unrecoveredPromise

// 一方、onRejectedを省略せずに何か値を返そうとするとその値で解決されたPromiseインスタンスが得られます。
const recoveredPromise = Promise.reject(new Error('エラー')).then(() => 1, err => err.message)

recoveredPromise

// onFulfileed, onRejectedの中でエラーが発生した場合、then()の戻り値のPromiseはそのエラーを理由に拒否されます。
const rejectedPromise = stringPromise.then(() => { throw new Error('エラー') })

rejectedPromise

// 2.3.2.2 catch()
// then()の引数に渡すonFulfilled, onRejectedはどちらも省略可能であるが、前者を省略する場合はthen()の代わりにcatch()が使えます。

// then()でonFulfilled()を省略
const withoutOnFulfilled = Promise.reject(new Error('エラー')).then(undefined, () => 0)

withoutOnFulfilled

// catch()の利用で同じ処理になる
const catchedPromise = Promise.reject(new Error('エラー')).catch(() => 0)

catchedPromise

// then()を2引数で実行するパターン
asyncFunc(input)
  .then(
    asyncFunc2, // onFulfilled
    err => { // onRejected
      // asyncFunc1用のエラーハンドリング
    }
  )
  .then(
    result => { // onFulfilled
      // この中で発生したエラーは第2引数(onRejected)でハンドリングされない
    },
    err => {  // onRejected
      // asyncFunc2用のエラーハンドリング
    }
)

// onRejectedを省略しthen()の後ろにcatch()をつけるパターン
asyncFunc1(input)
  .then(asyncFunc2 /* onFulfilled */)
  .then(result => {  // onFulfilled
  // この中で発生したエラーもcatch()に渡したonRejectedでハンドリングされる
  })
  .catch(err => {  // onRejected
  // ここにエラーハンドリングを集約できる
  })

// エラー発生時に必要な処理を行う一方で、エラーそのものは解消せずにそのまま伝播するパターンもよく見られます。
function doSomethingAsync(input) {
  return asyncFunc1(input)
    .catch(err => {
    // エラー発生時に必要な処理を行う
      // ここでは、デバッグ用にログを出力する
      console.error('asyncFunc1でエラー発生', err)
      throw err // またはreturn Promise.reject(err)
  })
}

// 2.3.2.3 finally()
const onFinally = () => console.log('finallyのコールバック')
// fulfilledなPromiseインスタンスに対して呼び出される場合
Promise.resolve().finally(onFinally)
// finallyのコールバック # onFinallyが実行される

const returnValueInFinally = Promise.resolve(1).finally(() => 2)

returnValueInFinally

const throwErrorInFinally = Promise.resolve(1).finally(() => { throw new Error('エラー') })

throwErrorInFinally

Promise.resolve('foo')
  .finally(() =>
    new Promise(resolve =>
      setTimeout(
        () => {
          console.log('finally()で1秒経過')
          resolve()
    }, 1000
      )
    )
)
  .then(console.log)

// 2.3.2.4 then(), catch(), finally()に渡すコールバックの実行タイミング
Promise.resolve('foo').then(result => console.log('コールバック', result))
console.log('この行が先に実行される')

// 2.3.3.1 Promise.all()
const allResolved = Promise.all([
  1, // Promise以外のものも含められる
  Promise.resolve('foo'),
  Promise.resolve(true)
])

allResolved

const containsRejected = Promise.all([
  1,
  Promise.resolve(('foo'),
    Promise.reject(new Error('エラー')),
    Promise.resolve(true)
])

containsRejected

Promise.all([])

// Entering editor mode
// 1秒かかる非同期処理
function asyncFunc() {
  return new Promise(resolve => setTimeout(resolve, 1000))
}

// perf_hooks.performance.now()で現在時刻を取得
const start = perf_hooks.performance.now()

// 逐次実行
asyncFunc()
  .then(asyncFunc)
  .then(asyncFunc)
  .then(asyncFunc)
  .then(() =>
    console.log('逐次実行所要時間', perf_hooks.performance.now() - start)
)
  
// Promise.all()で並行実行
Promise.all([
  asyncFunc(),
  asyncFunc(),
  asyncFunc(),
  asyncFunc()
])
  .then(() =>
    console.log('並行実行所要時間', perf_hooks.performance.now() - start)
)
  
// 2.3.3.2 Promise.race()
function wait(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

// 最初にfulfilledになるケース
const fulfilledFirst = Promise.race([
  wait(10).then(() => 1), // この結果が採用される
  wait(30).then(() => 'foo'),
  wait(20).then(() => Promise.reject(new Error('エラー')))
])

// 最初にrejectedになるケース
const rejectFirst = Promise.race([
  wait(20).then(() => 1),
  wait(30).then(() => 'foo'),
  // この結果が採用される
  wait(10).then(() => Promise.reject(new Error('エラー')))
])

// Promiseインスタンス以外の値が含まれるケース
const containsNonPromise = Promise.race([
  wait(10).then(() => 1),  
  'foo',  // この結果が採用される
  wait(20).then(() => Promise.reject(new Error('エラー')))
])

// 結果の確認
fulfilledFirst
rejectFirst
containsNonPromise

// 引数に空配列を渡すと、解決されることのない(pending状態にとどまる)Promiseインスタンスを返します。

const raceWithEmptyArray = Promise.race([])

raceWithEmptyArray

function withTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('タイムアウト')), timeout)
    )
  ])
}

// 20ミリ秒で完了する非同期処理
const promise = new Promise(resolve => setTimeout(() => resolve(1), 20))

// タイムアウト30ミリ秒で実行
const shouldBeResolved = withTimeout(promise, 30)

// タイムアウト10ミリ秒で実行
const shouldBeRejected = withTimeout(promise, 10)

// 2.3.3.3 Promise.allSettled()
const allSettled = Promise.allSettled([
  1,
  Promise.resolve('foo'),
  Promise.reject(new Error('エラー')),
  Promise.resolve(true)
])

allSettled

// 2.3.3.4 Promise.any()
const anyFulfilled = Promise.any([
  Promise.resolve('foo'),
  Promise.reject(new Error('エラー')),
  Promise.resolve(true)
])

anyFulfilled

// Promise.anyが使えないためこのコードはエラーになるが、将来的に実装可能になるはず
const noneFulfilled = Promise.any([
  Promise.reject(new Error('エラー1')),
  Promise.reject(new Error('エラー2'))
])

noneFulfilled

noneFulfilled.catch(err => console.log(err.errors))

Promise.any([])

Promise.any([]).catch(err => console.log(err.errors))

// 2.3.3.5 ショートサーキットの条件による各メソッドの分類

// 2.3.4 Promiseのメリット

const readdir = util.promisify(fs.readdir)

readdir('.').then(console.log)

setTimeout[util.promisify.custom]

const setTimeoutPromise = util.promisify(setTimeout)

setTimeoutPromise(1000).then(() => console.log('1秒経過'))

fs.promises.readdir('.').then(console.log)

// 2.4.1 ジェネレータの生成
/**
 * ジェネレータ関数
 */

function* generatorFunc() {
  yield 1
  yield 2
  yield 3
}

// ジェネレータの生成
const generator = generatorFunc()

function* generatorFunc() {
  console.log('ジェネレータ関数開始')
  console.log('yield 1')
  yield 1
  console.log('yield 2')
  yield 2
  console.log('ジェネレータ関数終了')
  return 'ジェネレータ関数戻り値'
}

const generator2 = generatorFunc()

const iterator = generator2[Symbol.iterator]()

iterator.next()

iterator === generator2

const generator3 = generatorFunc()

for (const v of generator3) {
  console.log('for...of', v)
}

const arrayIterator = [1, 2, 3][Symbol.iterator]()

arrayIterator.next()

// 2.4.3 引数を渡したnext()の実行、およびthrow()

// リセット可能なカウンタを実装するジェネレータ関数
function* resetableGeneratorFunc() {
  let count = 0
  while (true) {
    // next()を真に評価される引数(trueなど)で実行すると、
    // ここでカウンタがリセットされる
    if (yield count++) {
      count = 0
    }
  }
}

const resetableGenerator = resetableGeneratorFunc()

resetableGenerator.next()

resetableGenerator.next(true)


function* tryCatchGeneratorFunc() {
  try {
    yield 1
  } catch (err) {
    console.log('エラーをキャッチ', err)
    yield 2
  }
}

const tryCatchGenerator = tryCatchGeneratorFunc()

tryCatchGenerator.next()

tryCatchGenerator.throw(new Error('エラー'))

tryCatchGenerator.next()

try {
  // try...catchのないresetableGeneratorに対してthrow()を実行
  resetableGenerator.throw(new Error('エラー'))
} catch (err) {
  console.log('ジェネレータ外でエラーをキャッチ', err)
}

resetableGenerator.next()

// 2.4.4 ジェネレータを利用した非同期プログラミング

function parseJSONAsync(json) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      try {
      resolve(JSON.parse(json))
      } catch (err) {
        reject(err)
    }
    }, 1000)
  )
}

// yieldの仕組みを利用して非同期処理を実行する関数
function* asyncWithGeneratorFunc(json) {
  try {
    // 非同期処理の実行
    const result = yield parseJSONAsync(json)
    console.log('パース結果', result)
  } catch (err) {
    console.log('エラーをキャッチ', err)
  }
}

// 正常系
const asyncWithGenerator1 = asyncWithGeneratorFunc('{ "foo": 1 }')

// "yield parseJSONAsync(json)"で生成されるPromiseインスタンスの取得
const promise1 = asyncWithGenerator1.next().value

// Promiseインスタンスが解決された値をnext()メソッドに渡す
promise1.then(result => asyncWithGenerator1.next(result))

// 異常系
const asyncWithGenerator2 = asyncWithGeneratorFunc('不正なJSON')

// "yield parseJSONAsync(json)"で生成されるPromiseインスタンスの取得
const promise2 = asyncWithGenrator2.next().value

promise2.catch(err => asyncWithGenerator2.throw(err))

// 非同期処理を実行するジェネレータの汎用的なハンドリング関数
// 戻り値はPromiseインスタンス
function handleAsyncWithGenerator(generator, resolved) {
  // 前回yieldされたPromiseインスタンスの値を引数にnext()を実行
  // 初回はresolvedには値が入っていない(undefined)
  const { done, value } = generator.next(resolved)
  if (done) {
    // ジェネレータが完了した場合はvalueで解決されるPromiseインスタンスを返す
    return Promise.resolve(value)
  }
  return value.then(
    // 正常系では再起呼び出し
    resolved => handleAsyncWithGenerator(generator, resolved),
    // 異常系ではthrow()メソッドを実行
    err => generator.throw(err)
  )
}

handleAsyncWithGenerator(asyncWithGeneratorFunc('{ "foo": 1}'))
handleAsyncWithGenerator(asyncWithGeneratorFunc('不正なJSON'))

// 2.5 async/await

async function asyncFunc(input) {
  try {
    const result1 = await asyncFunc1(input)
    const result2 = await asyncFunc2(input)
    const result3 = await asyncFunc3(input)
    const result4 = await asyncFunc4(input)

  } catch (e) {
    // エラーハンドリング
  }
}

// 実際に使ってみましょう
// 非同期的にJSONをパースする関数(再掲)
function parseJSONAsync(json) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      try {
      resolve(JSON.parse(json))
      } catch (err) {
        reject(err)
    }
    }, 1000)
  )
}

// async/await構文を利用した非同期処理
async function asyncFunc(json) {
  try {
    const result = await parseJSONAsync(json)
    console.log('パース結果', result)
  } catch (err) {
    console.log('エラーをキャッチ', err)
  }
}

// 正常系
asyncFunc('{ "foo": 1}')

// 異常系
asyncFunc('不正なJSON')

// asyncキーワードの着いた関数(async関数)は必ずPromiseインスタンスを返します。
async function asyncReturnFoo() {
  return 'foo'
}

asyncReturnFoo()

// async関数内でエラーが投げられると、async関数はrejectedなPromiseインスタンスを返します。
async function asyncThrow() {
  throw new Error('エラー')
}

asyncThrow()

// ジェネレータ関数におけるyieldと同様、awaitは
// async関数内の処理を一時呈するものの、非同期I / Oのように
// スレッドの処理をブロックするわけではありません。

async function pauseAndResume(pausePeriod) {
  console.log('pauseAndResume開始')
  await new Promise(resolve => setTimeout(resolve, pausePeriod))
  console.log('pauseAndResume再開')
}

pauseAndResume(1000)
console.log('async関数外の処理はawaitの影響を受けない')

async function doSomethingAsyncConcurrently() {
  // 複数の非同期処理の並列実行
  const result = await Promise.all([
    asyncFunc1(),
    asyncFunc2(),
    asyncFunc3()
  ])
}

// 2.5.4 トップレベルawait

(async () => {
  // 非同期に値を取得
  const a = await getSomethingAsync()
})()

const asyncIterable = {
  [Symbol.asyncIterator]() {
    let i = 0
    // asyncイテレータ
    return {
      // value, doneプロパティを持つオブジェクトで解決されるPromiseを返す
      next() {
        if (i > 3) {
          return Promise.resolve({ done: true })
        }
        return new Promise(resolve => setTimeout(
          () => resolve({ value: i++, done: false }),
          100
        ))
      }
    }
  }
}

for await (const element of asyncIterable) {
  console.log(element)
}

// asyncジェネレータ関数
async function* asyncGenerator() {
  let i = 0
}