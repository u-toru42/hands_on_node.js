// 関数pow(x, n)

function pow(x, n) {
  let result = x;

  for (let i = 1; i < n; i++) {
    return *= x;
  }

  return result;
}

let x = prompt("x?", '');
let n = prompt("n?", '');

if (n <= 1) {
  alert(`Power ${n} is not supported, use an integer greater than 0`);
} else {
  alert(pow(x, n));
}

// アロー関数を使った書き換え前
function ask(question, yes, no) {
  if (confirm(question)) yes()
  else no();
}

ask(
  "Do you agree?",
  function() {
    alert("You agreed.");
  },
  function() {
    alert("You canceled the execution");
  }
);

// アロー関数を使った書き換え後

function ask(question, yes, no) {
  if (confirm(question)) yes()
  else no();
}

ask(
  "Do you agree?",
  () => alert("You agreed."),
  () => alert("You canceled the execution.")
)