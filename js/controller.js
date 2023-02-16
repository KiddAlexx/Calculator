'use strict';

// Store UI elements.
const btnCalc = document.querySelectorAll('.btn-calc');
const btnTheme = document.querySelectorAll('.input-theme');
const bodyEl = document.querySelector('body');
const bgVideoSource = document.querySelector('.bg-video-content source');
const bgVideo = document.querySelector('.bg-video-content');
const screenLower = document.querySelector('.screen-lower');
const screenUpper = document.querySelector('.screen-upper');

const toggleThemes = document.querySelector('.toggle-themes');
const toggleHistory = document.querySelector('.toggle-history');
const calcPanelLeft = document.querySelector('.calc-panel-left');
const calcPanelRight = document.querySelector('.calc-panel-right');

const calcPanelRightContainer = document.querySelector(
  '.calc-panel-right-container'
);
const btnHistoryDelete = document.querySelector('.btn-history-delete');

const btnAudioMute = document.querySelector('.audio-mute');
const btnAudioPlay = document.querySelector('.audio-play');

const audioNeonCity = new Audio('../audio/neon-city.mp3');
const audioMatrix = new Audio('../audio/matrix.mp3');
const audioHollowKnight = new Audio('../audio/hollow-knight.mp3');

// Data to use for cheking input type.
const numberValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const operatorValues = ['+', '-', 'x', '/'];

// Object to store all calculation data.
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

// Array to store each completed calculation as an object.
let calcHistory = [];

//////////////////////////////////////////////////
///////////// VIEW
////////////

// Check current data values and update screen accordingly.
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

// Function which takes the last item in calcHistory array,
// then pushes this data into the DOM to be displayed in the history panel.

const displayHistoryPanel = function () {
  const calc = calcHistory[calcHistory.length - 1];

  const historyHTML = `<div class="history-container" history-position="${
    calcHistory.length - 1
  }"> <div class="history-equation">${calc.num1} ${calc.operator} ${
    calc.num2
  } =</div>
        <div class="history-result">${calc.result}</div>
                       </div>`;

  calcPanelRightContainer.insertAdjacentHTML('beforeend', historyHTML);

  if (btnHistoryDelete.classList.contains('btn-history-delete-active')) {
    btnHistoryDelete.classList.remove('btn-history-delete-active');
  }
  if (!btnHistoryDelete.classList.contains('btn-history-hover')) {
    btnHistoryDelete.classList.add('btn-history-hover');
  }
};

// Listen for click on history panel
// then re-display selected calculation on screen

const displayHistoryScreen = function () {
  calcPanelRightContainer.addEventListener('click', e => {
    e.preventDefault();

    const historyContainer = e.target.closest('.history-container');

    if (historyContainer) {
      const id = historyContainer.getAttribute('history-position');
      console.log(id);
      console.log(e);

      const calc = calcHistory[id];

      resetObjectValues(calcData);

      // Re-assign selected calculation data to calcData object.
      calcData.numberOne = calc.num1;
      calcData.numberTwo = calc.num2;
      calcData.operator = calc.operator;
      calcData.result = calc.result;

      // This ensures that updateScreen() works to display the selected calculation on screen, treating a click of a previous calculation in the same way as selecting the = sign.
      assignDataValues('=');
      updateScreen();

      console.log(calcData);
    }
  });
};

// Function to clear history panel

const clearHistory = function () {
  btnHistoryDelete.addEventListener('click', e => {
    calcHistory = [];
    calcPanelRightContainer.innerHTML = '';

    btnHistoryDelete.classList.remove('btn-history-hover');
    btnHistoryDelete.classList.add('btn-history-delete-active');
    console.log(e);
  });
};

// Function to animate side panels of calculator

const animatePanels = function () {
  toggleThemes.addEventListener('change', e => {
    if (toggleThemes.checked === true) {
      calcPanelLeft.classList.add('calc-panel-left-active');
    } else {
      calcPanelLeft.classList.remove('calc-panel-left-active');
    }
  });
  toggleHistory.addEventListener('change', e => {
    if (toggleHistory.checked === true) {
      calcPanelRight.classList.add('calc-panel-right-active');
    } else {
      calcPanelRight.classList.remove('calc-panel-right-active');
    }
  });
};

// Function to switch between themes

const switchThemes = function () {
  btnTheme.forEach(button => {
    button.addEventListener('click', e => {
      const btnContent = e.target.id;

      audioNeonCity.pause();
      audioMatrix.pause();
      audioHollowKnight.pause();

      btnAudioMute.classList.add('btn-audio-active');
      btnAudioPlay.classList.remove('btn-audio-active');
      btnAudioMute.classList.remove('btn-audio-hover');
      btnAudioPlay.classList.add('btn-audio-hover');

      if (
        btnContent === 'neon-city' &&
        !bodyEl.classList.contains('theme-neon-city')
      ) {
        bodyEl.className = '';
        bodyEl.classList.add('theme-neon-city');
        bgVideoSource.src = 'img/neon-city-bg.mp4';
        bgVideo.load();
      }

      if (
        btnContent === 'matrix' &&
        !bodyEl.classList.contains('theme-matrix')
      ) {
        bodyEl.className = '';
        bodyEl.classList.add('theme-matrix');
        bgVideoSource.src = 'img/matrix-1080p.mp4';
        bgVideo.load();
      }
      if (
        btnContent === 'hollow-knight' &&
        !bodyEl.classList.contains('theme-hollow-knight')
      ) {
        bodyEl.className = '';
        bodyEl.classList.add('theme-hollow-knight');
        bgVideoSource.src = 'img/hollow-knight-sm.mp4';
        bgVideo.load();
      }

      console.log(btnContent);
    });
  });
};

// Function to play and pause audio

const themeAudio = function () {
  btnAudioPlay.addEventListener('click', e => {
    if (
      bodyEl.classList.contains('theme-neon-city') &&
      !btnAudioPlay.classList.contains('btn-audio-active')
    ) {
      audioNeonCity.play();
      btnAudioPlay.classList.add('btn-audio-active');
      btnAudioPlay.classList.remove('btn-audio-hover');
      btnAudioMute.classList.remove('btn-audio-active');
      btnAudioMute.classList.add('btn-audio-hover');
    }

    if (
      bodyEl.classList.contains('theme-matrix') &&
      !btnAudioPlay.classList.contains('btn-audio-active')
    ) {
      audioMatrix.volume = 0.4;
      audioMatrix.play();
      btnAudioPlay.classList.add('btn-audio-active');
      btnAudioPlay.classList.remove('btn-audio-hover');
      btnAudioMute.classList.remove('btn-audio-active');
      btnAudioMute.classList.add('btn-audio-hover');
    }

    if (
      bodyEl.classList.contains('theme-hollow-knight') &&
      !btnAudioPlay.classList.contains('btn-audio-active')
    ) {
      audioHollowKnight.play();
      btnAudioPlay.classList.add('btn-audio-active');
      btnAudioPlay.classList.remove('btn-audio-hover');
      btnAudioMute.classList.remove('btn-audio-active');
      btnAudioMute.classList.add('btn-audio-hover');
    }
  });

  btnAudioMute.addEventListener('click', e => {
    if (
      bodyEl.classList.contains('theme-neon-city') &&
      !btnAudioMute.classList.contains('btn-audio-active')
    ) {
      audioNeonCity.pause();
      btnAudioMute.classList.add('btn-audio-active');
      btnAudioMute.classList.remove('btn-audio-hover');
      btnAudioPlay.classList.remove('btn-audio-active');
      btnAudioPlay.classList.add('btn-audio-hover');
    }
    if (
      bodyEl.classList.contains('theme-matrix') &&
      !btnAudioMute.classList.contains('btn-audio-active')
    ) {
      audioMatrix.pause();
      btnAudioMute.classList.add('btn-audio-active');
      btnAudioMute.classList.remove('btn-audio-hover');
      btnAudioPlay.classList.remove('btn-audio-active');
      btnAudioPlay.classList.add('btn-audio-hover');
    }
    if (
      bodyEl.classList.contains('theme-hollow-knight') &&
      !btnAudioMute.classList.contains('btn-audio-active')
    ) {
      audioHollowKnight.pause();
      btnAudioMute.classList.add('btn-audio-active');
      btnAudioMute.classList.remove('btn-audio-hover');
      btnAudioPlay.classList.remove('btn-audio-active');
      btnAudioPlay.classList.add('btn-audio-hover');
    }
  });
};

//////////////////////////////////////////////////
//////////// CALCULATOR FUNCTION
///////////

// Takes two numbers and calculates result based upon current operator value.
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

  // Assign sum to result.
  // If length of sum greater than 11,
  // then convert to exponential notation with 6 decimal places.
  sum.toString().length > 11
    ? (calcData.result = sum.toExponential(6))
    : (calcData.result = sum);

  calcHistory.push({
    num1: calcData.numberOne,
    num2: calcData.numberTwo,
    operator: calcData.operator,
    result: calcData.result,
  });

  displayHistoryPanel();
};

// Takes an input and assigns it a type and a value.
// The content will be passed from the collecInputs functions.
const assignDataValues = function (content) {
  let type;
  let value;

  if (numberValues.includes(content)) {
    type = 'number';
    value = content;
  }
  if (operatorValues.includes(content)) {
    type = 'operator';
    value = content;
  }

  if (content === '*') {
    type = 'operator';
    value = 'x';
  }

  if (content === '=' || content === 'Enter') {
    type = 'equals';
    value = '=';
  }

  if (content === 'Escape' || content === 'CL') {
    type = 'clear';
    value = 'CL';
  }
  if (content === 'Delete' || content === 'Backspace' || content === 'DEL') {
    type = 'delete';
    value = 'DEL';
  }
  if (content === '+/-') {
    type = 'positiveNegative';
  }
  if (content === '.') {
    type = 'decimal';
    value = '.';
  }
  // Checks whether there has been a previous input,
  // Updates previous value and type with current value and type.
  if (calcData.curValue != '') {
    calcData.prevValue = calcData.curValue;
    calcData.prevType = calcData.curType;
  }
  //Assigns content to curValue and type to curType
  calcData.curValue = value;
  calcData.curType = type;
  return value;
};

// Handle button clicks, update calculation data and display results on screen.
const collectInputsClick = function () {
  btnCalc.forEach(button => {
    button.addEventListener('click', e => {
      const btnContent = e.target.innerText;

      assignDataValues(btnContent);
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

// Handle keypress, update calculation data and display results on screen.
const collectInputsKey = function () {
  document.addEventListener('keydown', function (e) {
    e.preventDefault();
    const btnContent = e.key;

    assignDataValues(btnContent);
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

const animateKeys = function () {
  document.addEventListener('keydown', function (e) {
    const btnValue = assignDataValues(e.key);

    btnCalc.forEach(function (btn) {
      if (btn.innerText === btnValue) {
        btn.classList.add('key-active');
      }
    });
  });

  document.addEventListener('keyup', function (e) {
    const btnValue = assignDataValues(e.key);
    btnCalc.forEach(function (btn) {
      if (btn.innerText === btnValue) {
        btn.classList.remove('key-active');
      }
    });
  });
};

// Take an object as argument and resets it's values to empty string or empty array.
const resetObjectValues = function (obj) {
  Object.keys(obj).forEach(value => {
    if (typeof obj[value] === 'string' || typeof obj[value] === 'number')
      obj[value] = '';
    if (Array.isArray(obj[value])) {
      obj[value] = [];
    }
  });
};

// Main logic of calculator. Assigns data values based upon input.
const calculatorLogic = function () {
  // If input is 'clear' or if input is a number and the previous input was '=',
  // then reset all the values in calcData to their initial state.
  if (
    calcData.curType === 'clear' ||
    (calcData.curType === 'number' && calcData.prevType === 'equals')
  ) {
    resetObjectValues(calcData);
  }
  // If input is 'delete',
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
  if (
    calcData.curType === 'decimal' &&
    !calcData.activeNumber.includes('.') &&
    calcData.activeNumber.length === 0
  ) {
    calcData.activeNumber.push('0', calcData.curValue);
  }
  // If input is '.' and activeNumber does not contain '.'
  // and activeNumber is empty
  // then add 0. at the beggining of activeNumber
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
animateKeys();
themeAudio();
switchThemes();
animatePanels();
displayHistoryScreen();
clearHistory();
