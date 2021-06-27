// このテストは何が問題でしょう？

it("Raises x to the power n", function() {
  let x = 5;

  let result = x;
  assert.equal(pow(x, 1), result);

  result *= x;
  assert.equal(pow(x, 2), result);

  result *= x;
  assert.equal(pow(x, 3), result);
});

/**解答
 * 
 * このテストは、テストを書く時に
 * 開発者が出会うテンプレートの1つです。

ここで実際に持っているテストは 3つですが、
3つのアサートを持つ1つの関数として並べられています。

この方法で書くほうが簡単な場合もありますが、
エラーが起きた時、何が間違っていたのかが明らかではありません。

もし複雑な実行フローの中でエラーが起きた場合、
その時のデータを把握する必要があります。
実際に テストをデバッグしなければならなくなります。

テストを、入出力が明白に書かれた複数の
 it ブロックに崩す方がはるかに良いです。

このように:
 * 
 */

descrive("Raises x to power n", function() {
  it("5 in the power of 1 equals 5", function() {
    assert.equal(pow(5, 1), 5);
  });

  it("5 in the power of 2 equals 25", function() {
    assert.equal(pow(5, 2), 25);
  });
  /**
   * 単一の it を
   *  describe と it ブロックのグループに置き換えました。 
   * 今何かが失敗した場合、データが何であるかが明確に分かります。

   * また、it の代わりに it.only を書くことで、
   * 単一のテストに分離し、
   * スタンドアローンモードで実行することができます。
   */
  it.only("5 in the power of 2 equals 25", function() {
    assert.equal(pow(5, 2), 25);
  })

  it("5 in the power of 3 equals 125", function() {
    assert.equal(pow(5, 3), 125);
  });
})