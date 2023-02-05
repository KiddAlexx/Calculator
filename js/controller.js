'use strict';

const buttons = document.querySelectorAll('.btn');
const screenLower = document.querySelector('.screen-lower');
const screenUpper = document.querySelector('.screen-upper');

const numberValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const operatorValues = ['+', '-', 'x', '/', '*'];

const calcData = {
  activeNumber: [],
  operatorArr: [],
  curValue: '',
  curType: '',
  prevValue: '',
  prevType: '',
  numberOne: '',
  numberTwo: '',
  operator: '',
  result: '',
};

//////////////////////////////////////////////////
///////////// VIEW
////////////

const updateScreen = function () {
  if (calcData.activeNumber.length > 0) {
    screenLower.innerText = calcData.activeNumber
      .toString()
      .replaceAll(',', '');
  } else if (
    calcData.numberOne &&
    calcData.activeNumber.length < 1 &&
    !calcData.result
  ) {
    screenLower.innerText = calcData.numberOne;
  } else if (calcData.result) {
    screenLower.innerText = calcData.result;
  } else {
    screenLower.innerText = '0';
  }

  if (calcData.numberOne && !calcData.result) {
    screenUpper.innerText = `${calcData.numberOne} ${
      calcData.operatorArr.length > 0
        ? calcData.operatorArr.slice(-1)
        : calcData.operator
    }`;
  } else if (calcData.result && calcData.curType === 'equals') {
    screenUpper.innerText = `${calcData.numberOne} ${calcData.operator} ${calcData.numberTwo} =`;
  } else if (calcData.result) {
    screenUpper.innerText = `${calcData.result} ${
      calcData.operatorArr.length > 0
        ? calcData.operatorArr.slice(-1)
        : calcData.operator
    }`;
  } else {
    screenUpper.innerText = '';
  }
};

////////////////////////////////////////////////////////
//////// CALCULATOR FUNCTION
////////

const calculateResult = function (numOne, numTwo) {
  let sum;

  if (calcData.operator === '+') {
    sum = numOne + numTwo;
  }
  if (calcData.operator === '-') {
    sum = numOne - numTwo;
  }
  if (calcData.operator === 'x' || calcData.operator === '*') {
    sum = numOne * numTwo;
  }
  if (calcData.operator === '/') {
    sum = numOne / numTwo;
  }

  sum.toString().length > 11
    ? (calcData.result = sum.toExponential(6))
    : (calcData.result = sum);
};

const assignValues = function (content) {
  let type;

  if (numberValues.includes(content)) {
    type = 'number';
  }
  if (operatorValues.includes(content)) {
    type = 'operator';
  }

  if (content === '=' || content === 'Enter') {
    type = 'equals';
  }

  if (content === 'Escape' || content === 'CL') {
    type = 'clear';
  }
  if (content === 'Delete' || content === 'Backspace' || content === 'DL') {
    type = 'delete';
  }
  if (content === '+/-') {
    type = 'positiveNegative';
  }
  if (content === '.') {
    type = 'decimal';
  }

  if (calcData.curValue != '') {
    calcData.prevValue = calcData.curValue;
    calcData.prevType = calcData.curType;
  }
  content === 'Enter'
    ? (calcData.curValue = '=')
    : (calcData.curValue = content);
  calcData.curType = type;
};

const collectInputsClick = function () {
  buttons.forEach(button => {
    button.addEventListener('click', event => {
      const btnContent = event.target.innerText;

      assignValues(btnContent);
      calculatorLogic();
      updateScreen();
      console.log(calcData.curValue);
      console.log(calcData.curType);
      console.log(calcData.prevValue);
      console.log(calcData.prevType);
      console.log(calcData.activeNumber);
      console.log(calcData.operatorArr);
      console.log(calcData.numberOne);
      console.log(calcData.numberTwo);
      console.log(calcData.operator);
      console.log(calcData.result);
    });
  });
};

const collectInputsKey = function () {
  document.addEventListener('keydown', function (event) {
    event.preventDefault();
    const btnContent = event.key;

    assignValues(btnContent);
    calculatorLogic();
    updateScreen();
    console.log(calcData.curValue);
    console.log(calcData.curType);
    console.log(calcData.prevValue);
    console.log(calcData.prevType);
    console.log(calcData.activeNumber);
    console.log(calcData.operatorArr);
    console.log(calcData.numberOne);
    console.log(calcData.numberTwo);
    console.log(calcData.operator);
    console.log(calcData.result);
  });
};

const resetObjectValues = function (obj) {
  Object.keys(obj).forEach(value => {
    if (typeof obj[value] === 'string' || typeof obj[value] === 'number')
      obj[value] = '';
    if (Array.isArray(obj[value])) {
      obj[value] = [];
    }
  });
};

const calculatorLogic = function () {
  // If input is 'clear' or if input is a number and the previous input was '=',
  // then reset all the values in calcData to their initial state.
  if (
    calcData.curType === 'clear' ||
    (calcData.curType === 'number' && calcData.prevType === 'equals')
  ) {
    resetObjectValues(calcData);
  }
  // If inout is 'delete',
  // then remove last value from activeNumber array.
  if (calcData.curType === 'delete') {
    calcData.activeNumber.pop();
  }
  // If input is '+/-' toggle by adding/removing '-' from the beggining of activeNumber.
  if (calcData.curType === 'positiveNegative') {
    calcData.activeNumber[0] === '-'
      ? calcData.activeNumber.shift()
      : calcData.activeNumber.unshift('-');
  }
  // If  input is a number and the active number is less than 11,
  // then add current value to the end of the active number array.
  if (calcData.curType === 'number' && calcData.activeNumber.length < 11) {
    calcData.activeNumber.push(calcData.curValue);
  }
  // If input is a number and the result has a value,
  // then re-assign the value of the result to numberOne.
  if (calcData.curType === 'number' && calcData.result) {
    calcData.numberOne = calcData.result;
  }
  // If input is a number, previous input was an operator, and number one has value,
  // then assign last value of operator array to operator and reset operator array to an empty array.
  if (
    calcData.curType === 'number' &&
    calcData.prevType === 'operator' &&
    calcData.numberOne
  ) {
    calcData.operator = calcData.operatorArr.pop();
    calcData.operatorArr = [];
  }
  // If input is '.' and activeNumber does not contain '.'
  // then add '.' to end of activeNumber
  if (calcData.curType === 'decimal' && !calcData.activeNumber.includes('.')) {
    calcData.activeNumber.push(calcData.curValue);
  }
  // If  input is an operator,
  // then add current value to the end of the operator array.
  if (calcData.curType === 'operator') {
    calcData.operatorArr.push(calcData.curValue);
  }
  // If  input is an operator, activeNumber has value and numberOne does not,
  // then assign aciveNumber to numberOne and clear activeNumber array.
  if (
    calcData.curType === 'operator' &&
    calcData.activeNumber &&
    !calcData.numberOne
  ) {
    calcData.numberOne = +calcData.activeNumber.toString().replaceAll(',', '');
    calcData.activeNumber = [];
  }
  //If input is an operator, previous input was number, activeNumber has value, and numberOne exists,
  // or input is '=', activeNumber has value, and numberOne exists,
  // then assign activeNumber to numberTwo, clear activeNumber array and run calculateResult function using numberOne and numberTwo.
  if (
    (calcData.curType === 'operator' &&
      calcData.prevType === 'number' &&
      calcData.activeNumber.length != 0 &&
      calcData.numberOne) ||
    (calcData.curType === 'equals' &&
      calcData.activeNumber.length != 0 &&
      calcData.numberOne)
  ) {
    calcData.numberTwo = +calcData.activeNumber.toString().replaceAll(',', '');
    calcData.activeNumber = [];
    calculateResult(calcData.numberOne, calcData.numberTwo);
  }
};

collectInputsClick();
collectInputsKey();
