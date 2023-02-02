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

    if (currentKey.value != null) {
      previousKey.value = currentKey.value;
      previousKey.type = currentKey.type;
    }

    currentKey.value = btnContent;
    currentKey.type = btnType;

    if (
      currentKey.type === 'number' &&
      (previousKey.type === 'number' || previousKey.type === null)
    ) {
      activeNumber.push(currentKey.value);
    }
    if (currentKey.type === 'operator' && activeNumber.length != 0) {
      operatorArr.push(currentKey.value);
    }

    console.log(previousKey);
    console.log(currentKey);
    console.log(activeNumber);
    console.log(operatorArr);
  });
});

/*     if (numberValues.includes(btnContent)) {
      activeNumber.push(btnContent);
    }

    if (operatorValues.includes(btnContent)) {
      operatorArr.push(btnContent);
      numberOne = activeNumber.toString().replaceAll(',', '');
      activeNumber = [];
    } 
    
      console.log(activeNumber);
    console.log(numberOne);
    console.log(operatorArr);*/
