'use strict';

const buttons = document.querySelectorAll('.btn');
const screenLower = document.querySelector('.screen-lower');
const screenUpper = document.querySelector('.screen-upper');

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
      if (btnContent === 'CL') {
        btnType = 'clear';
      }
      if (btnContent === 'DL') {
        btnType = 'delete';
      }
      if (btnContent === '+/-') {
        btnType = 'positiveNegative';
      }
      if (btnContent === '.') {
        btnType = 'decimal';
      }

      if (currentKey.value != null) {
        previousKey.value = currentKey.value;
        previousKey.type = currentKey.type;
      }

      currentKey.value = btnContent;
      currentKey.type = btnType;

      if (currentKey.type === 'clear') {
        activeNumber = [];
        operatorArr = [];
        previousKey.value = null;
        previousKey.type = null;
        currentKey.value = null;
        currentKey.type = null;
        numberOne = '';
        numberTwo = '';
        operator = '';
        result = '';
      }
      if (currentKey.type === 'delete') {
        activeNumber.pop();
      }
      if (currentKey.type === 'positiveNegative') {
        activeNumber[0] === '-'
          ? activeNumber.shift()
          : activeNumber.unshift('-');
      }

      if (currentKey.type === 'number') {
        activeNumber.push(currentKey.value);
      }
      if (currentKey.type === 'number' && previousKey.type === 'equals') {
        operatorArr = [];
        previousKey.value = null;
        previousKey.type = null;
        currentKey.value = null;
        currentKey.type = null;
        numberOne = '';
        numberTwo = '';
        operator = '';
        result = '';
      }

      if (currentKey.type === 'decimal' && !activeNumber.includes('.')) {
        activeNumber.push(currentKey.value);
      }
      if (currentKey.type === 'operator') {
        operatorArr.push(currentKey.value);
      }
      if (
        currentKey.type === 'number' &&
        previousKey.type === 'operator' &&
        numberOne
      ) {
        operator = operatorArr.pop();
        operatorArr = [];
      }

      if (currentKey.type === 'operator' && activeNumber && !numberOne) {
        numberOne = +activeNumber.toString().replaceAll(',', '');
        activeNumber = [];
      }

      if (
        currentKey.type === 'equals' &&
        activeNumber.length != 0 &&
        numberOne
      ) {
        numberTwo = +activeNumber.toString().replaceAll(',', '');
        activeNumber = [];
        calculateResult();
        numberOne = result;
      }

      if (
        currentKey.type === 'operator' &&
        previousKey.type === 'number' &&
        activeNumber.length != 0 &&
        numberOne
      ) {
        numberTwo = +activeNumber.toString().replaceAll(',', '');
        activeNumber = [];
        calculateResult();
        numberOne = result;
      }
      updateScreen();

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

//////////////////////////////////////////////////
///////////// VIEW
////////////

const updateScreen = function () {
  if (activeNumber) {
    screenLower.innerText = activeNumber.toString().replaceAll(',', '');
  }

  if (numberOne && !activeNumber) {
    screenLower.innerText = numberOne;
  }

  if (numberOne) {
    screenUpper.innerText = numberOne;
  }
};
