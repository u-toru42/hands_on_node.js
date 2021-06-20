const array1 = [0, 1, 2, 3]
const array2 = array1.map((element) => {
  console.log(`${element}を変換します`);
  return element * 10
});
console.log('配列の変換が完了しました', array2);