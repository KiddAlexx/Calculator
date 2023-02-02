'use strict';

const buttons = document.querySelectorAll('.btn');

const numberValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const operatorValues = ['+', '-', 'X', '/'];

let activeNumber = [];
let operatorArr = [];

let currentKey = {
  value: null,
  type: null,
};

let previousKey = {
  value: null,
  type: null,
};

let numberOne;
let numberTwo;
let operator;
let result;

const calculateResult = function () {
  if (operator === '+') {
    result = numberOne + numberTwo;
  }
  if (operator === '-') {
    result = numberOne - numberTwo;
  }
  if (operator === 'X') {
    result = numberOne * numberTwo;
  }
  if (operator === '/') {
    result = numberOne / numberTwo;
  }
};

const collectInputs = function () {
  buttons.forEach(button => {
    button.addEventListener('click', event => {
      const btnContent = event.target.innerText;

      let btnType;

      if (numberValues.includes(btnContent)) {
        btnType = 'number';
      }
      if (operatorValues.includes(btnContent)) {
        btnType = 'operator';
      }

      if (btnContent === '=') {
        btnType = 'equals';
      }

      if (currentKey.value != null) {
        previousKey.value = currentKey.value;
        previousKey.type = currentKey.type;
      }

      currentKey.value = btnContent;
      currentKey.type = btnType;

      if (currentKey.type === 'number') {
        activeNumber.push(currentKey.value);
      }
      if (
        currentKey.type === 'number' &&
        previousKey.type === 'operator' &&
        numberOne
      ) {
        operator = operatorArr.pop();
      }
      if (
        currentKey.type === 'operator' &&
        previousKey.type === 'number' &&
        activeNumber.length != 0 &&
        !numberOne
      ) {
        operatorArr.push(currentKey.value);
        numberOne = +activeNumber.toString().replaceAll(',', '');
        activeNumber = [];
      }
      if (
        currentKey.type === 'operator' &&
        previousKey.type === 'operator' &&
        activeNumber.length === 0 &&
        numberOne
      ) {
        operatorArr.push(currentKey.value);
      }

      if (
        currentKey.type === 'equals' &&
        activeNumber.length != 0 &&
        numberOne
      ) {
        numberTwo = +activeNumber.toString().replaceAll(',', '');
        activeNumber = [];
        calculateResult();
      }

      console.log(previousKey);
      console.log(currentKey);
      console.log(activeNumber);
      console.log(operatorArr);
      console.log(numberOne);
      console.log(numberTwo);
      console.log(operator);
      console.log(result);
    });
  });
};

collectInputs();
