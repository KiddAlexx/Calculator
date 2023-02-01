const buttons = document.querySelectorAll('.btn');
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const numberOne = [];

buttons.forEach(button => {
  button.addEventListener('click', event => {
    if (numbers.includes(event.target.innerText)) {
      numberOne.push(event.target.innerText);
    }

    console.log(numberOne);
  });
});
