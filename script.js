const display = document.querySelector("#display");
const keys = document.querySelector(".keys");

let currentValue = "0";
let storedValue = null;
let pendingOperator = null;
let replaceCurrent = false;

function render() {
  display.textContent = currentValue;
}

function enterDigit(digit) {
  if (replaceCurrent || currentValue === "0" || currentValue === "Error") {
    currentValue = digit;
    replaceCurrent = false;
  } else {
    currentValue += digit;
  }
  render();
}

function enterDecimal() {
  if (replaceCurrent || currentValue === "Error") {
    currentValue = "0.";
    replaceCurrent = false;
  } else if (!currentValue.includes(".")) {
    currentValue += ".";
  }
  render();
}

function calculate(left, right, operator) {
  switch (operator) {
    case "+": return left + right;
    case "-": return left - right;
    case "*": return left * right;
    case "/": return right === 0 ? null : left / right;
    default: return right;
  }
}

function formatResult(value) {
  if (value === null || !Number.isFinite(value)) return "Error";
  return String(Number(value.toPrecision(12)));
}

function chooseOperator(operator) {
  const value = Number(currentValue);

  if (pendingOperator && !replaceCurrent) {
    const result = calculate(storedValue, value, pendingOperator);
    currentValue = formatResult(result);
    render();
    if (currentValue === "Error") {
      storedValue = null;
      pendingOperator = null;
      replaceCurrent = true;
      return;
    }
    storedValue = Number(currentValue);
  } else {
    storedValue = value;
  }

  pendingOperator = operator;
  replaceCurrent = true;
}

function solve() {
  if (!pendingOperator || storedValue === null || currentValue === "Error") return;

  currentValue = formatResult(
    calculate(storedValue, Number(currentValue), pendingOperator),
  );
  storedValue = null;
  pendingOperator = null;
  replaceCurrent = true;
  render();
}

function clear() {
  currentValue = "0";
  storedValue = null;
  pendingOperator = null;
  replaceCurrent = false;
  render();
}

function deleteLast() {
  if (replaceCurrent || currentValue === "Error") {
    currentValue = "0";
    replaceCurrent = false;
  } else {
    currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
    if (currentValue === "-" || currentValue === "") currentValue = "0";
  }
  render();
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.digit !== undefined) enterDigit(button.dataset.digit);
  if (button.dataset.operator) chooseOperator(button.dataset.operator);
  if (button.dataset.action === "decimal") enterDecimal();
  if (button.dataset.action === "equals") solve();
  if (button.dataset.action === "clear") clear();
  if (button.dataset.action === "delete") deleteLast();
});

document.addEventListener("keydown", (event) => {
  if (/^\d$/.test(event.key)) enterDigit(event.key);
  else if (event.key === ".") enterDecimal();
  else if (["+", "-", "*", "/"].includes(event.key)) chooseOperator(event.key);
  else if (event.key === "Enter" || event.key === "=") solve();
  else if (event.key === "Backspace") deleteLast();
  else if (event.key === "Escape") clear();
  else return;

  event.preventDefault();
});
