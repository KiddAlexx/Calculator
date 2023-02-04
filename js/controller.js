'use strict';

const buttons = document.querySelectorAll('.btn');
const screenLower = document.querySelector('.screen-lower');
const screenUpper = document.querySelector('.screen-upper');

const numberValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const operatorValues = ['+', '-', 'x', '/'];

const calcData = {
  activeNumber: [],
  operatorArr: [],
  curValue: null,
  curType: null,
  prevValue: null,
  prevType: null,
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
  if (calcData.operator === '+') {
    calcData.result = numOne + numTwo;
  }
  if (calcData.operator === '-') {
    calcData.result = numOne - numTwo;
  }
  if (calcData.operator === 'x') {
    calcData.result = numOne * numTwo;
  }
  if (calcData.operator === '/') {
    calcData.result = numOne / numTwo;
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

      if (calcData.curValue != null) {
        calcData.prevValue = calcData.curValue;
        calcData.prevType = calcData.curType;
      }

      calcData.curValue = btnContent;
      calcData.curType = btnType;

      if (calcData.curType === 'clear') {
        calcData.activeNumber = [];
        calcData.operatorArr = [];
        calcData.prevValue = null;
        calcData.prevType = null;
        calcData.curValue = null;
        calcData.curType = null;
        calcData.numberOne = '';
        calcData.numberTwo = '';
        calcData.operator = '';
        calcData.result = '';
      }
      if (calcData.curType === 'delete') {
        calcData.activeNumber.pop();
      }
      if (calcData.curType === 'positiveNegative') {
        calcData.activeNumber[0] === '-'
          ? calcData.activeNumber.shift()
          : calcData.activeNumber.unshift('-');
      }

      if (calcData.curType === 'number') {
        calcData.activeNumber.push(calcData.curValue);
      }
      if (calcData.curType === 'number' && calcData.result) {
        calcData.numberOne = calcData.result;
      }
      if (calcData.curType === 'number' && calcData.prevType === 'equals') {
        calcData.numberOne = calcData.result;
        calcData.operatorArr = [];
        calcData.prevValue = null;
        calcData.prevType = null;
        calcData.curValue = null;
        calcData.curType = null;
        calcData.numberOne = '';
        calcData.numberTwo = '';
        calcData.operator = '';
        calcData.result = '';
      }

      if (
        calcData.curType === 'decimal' &&
        !calcData.activeNumber.includes('.')
      ) {
        calcData.activeNumber.push(calcData.curValue);
      }
      if (calcData.curType === 'operator') {
        calcData.operatorArr.push(calcData.curValue);
      }
      if (
        calcData.curType === 'number' &&
        calcData.prevType === 'operator' &&
        calcData.numberOne
      ) {
        calcData.operator = calcData.operatorArr.pop();
        calcData.operatorArr = [];
      }

      if (
        calcData.curType === 'operator' &&
        calcData.activeNumber &&
        !calcData.numberOne
      ) {
        calcData.numberOne = +calcData.activeNumber
          .toString()
          .replaceAll(',', '');
        calcData.activeNumber = [];
      }

      if (
        calcData.curType === 'equals' &&
        calcData.activeNumber.length != 0 &&
        calcData.numberOne
      ) {
        calcData.numberTwo = +calcData.activeNumber
          .toString()
          .replaceAll(',', '');
        calcData.activeNumber = [];
        calculateResult(calcData.numberOne, calcData.numberTwo);
      }

      if (
        calcData.curType === 'operator' &&
        calcData.prevType === 'number' &&
        calcData.activeNumber.length != 0 &&
        calcData.numberOne
      ) {
        calcData.numberTwo = +calcData.activeNumber
          .toString()
          .replaceAll(',', '');
        calcData.activeNumber = [];
        calculateResult(calcData.numberOne, calcData.numberTwo);
      }

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
      updateScreen();
    });
  });
};

collectInputs();
