const PLAYER = '🧑‍🦱';
const GREEN_BLOCK = '🟩';

function mineBoard(length, playerPos, minePos) {
  console.clear();
  let board = '';
  let currentPos = 0;

  for (let col = 0; col < length; col++) {
    for (let row = 0; row < length; row++) {
      currentPos++;
      if (playerPos === currentPos) {
        board += PLAYER;
      } else {
        board += GREEN_BLOCK;
      }
    }
    if (col === length - 1) {
      board += '⬅️ start'
    }
    board += '\n';
  }

  return board;
}

function controler(char, currentPos, length) {
  if (char === 'W' || char === 'w')
    return currentPos <= length ? currentPos : currentPos - length;
  if (char === 'A' || char === 'a')
    return currentPos % length === 1 ? currentPos : currentPos - 1;
  if (char === 'D' || char === 'd')
    return currentPos % length === 0 ? currentPos : currentPos + 1;
  if (char === 'S' || char === 's')
    return currentPos > Math.pow(length, 2) - length ? currentPos : currentPos + length;
  const validChar = prompt('Please enter a valid input...');
  return controler(validChar, currentPos, length);
}

function isInputValid(length, noOfMines) {
  console.clear();
  if (length * length * (2 / 3) < noOfMines) {
    console.log('Sorry, you have entered more mines than boxes.');
    return false;
  }

  if (noOfMines === 0 || length === 1) {
    console.log('Input number seems to be lesser than required. Mines should be more than 1 and spaces should be more than 1.');
    return false;
  }

  if (isNaN(length) || isNaN(noOfMines)) {
    console.log('Input is not number.');
    return false;
  }

  return true
}

function randomPos() {
  return Math.floor(Math.random() * 3) + 1;
}

function mineGenrator(currentPos, length, lastPos) {
  const isDownValid = !(currentPos > ((length * length) - length)) && currentPos + length !== lastPos;
  const isLeftValid = !(currentPos % length === 1) && currentPos - 1 !== lastPos;
  const isRightValid = !(currentPos % length === 0) && currentPos + 1 !== lastPos;
  const isUpValid = !(currentPos <= length) && currentPos - length !== lastPos;

  const leftPosIndex = currentPos - 1;
  const rightPosIndex = currentPos + 1;
  const upPosIndex = currentPos - length;
  const downPosIndex = currentPos + length;

  if (isLeftValid && isDownValid && isRightValid) {
    const selectingRightOrLeft = randomPos() === 1 ? leftPosIndex : rightPosIndex;
    return randomPos() === 1 ? downPosIndex : selectingRightOrLeft;
  }

  if (isRightValid && isUpValid && isLeftValid) {
    const selectingRightOrLeft = randomPos() === 1 ? leftPosIndex : rightPosIndex;
    return randomPos() === 1 ? upPosIndex : selectingRightOrLeft;
  }

  if (isRightValid && isUpValid) {
    return randomPos() === 1 ? upPosIndex : rightPosIndex;
  }

  if (isRightValid && isDownValid) {
    return randomPos() === 1 ? downPosIndex : rightPosIndex;
  }

  if (isLeftValid && isUpValid) {
    return randomPos() === 1 ? upPosIndex : leftPosIndex;
  }

  if (isLeftValid && isDownValid) {
    return randomPos() === 1 ? downPosIndex : leftPosIndex;
  }
}

function messageAccToResult(currentPos, steps) {
  if (currentPos > 1) {
    console.log('Yehe you lose... 🥲😓\nBetter luck next time...');
    return;
  }
  console.log('Wooohoo! You win... 🤩🏆🥇\nYou took ' + steps + ' steps.')

}

function mineSweeper(length, noOfLives) {
  if (!isInputValid(length, noOfLives)) return;

  let chancesLeft = noOfLives;
  let currentPos = length * length;
  let lastPos = currentPos;
  let steps = 0;
  while (!(currentPos === 1)) {
    lastPos = currentPos;
    const mineAt = mineGenrator(currentPos, length, lastPos);
    console.log(mineBoard(length, currentPos, mineAt));
    const charToControl = prompt('Enter W to ⬆️ , A to ⬅️ , S to ⬇️ and D to ➡️ :');
    currentPos = controler(charToControl, currentPos, length);
    steps++;
    if (mineAt === currentPos && !(mineAt === 1)) {
      chancesLeft--;

      console.clear();
      console.log('You have only ' + chancesLeft + ' chances left.');
      console.log('There is a mine...💥💥💣');
      for (let i = 0; i < length * 420000000; i++) { }
      currentPos = lastPos;
    }
    if (chancesLeft === 0) break;
    console.log('\n');
  }
  console.log(mineBoard(length, currentPos));
  messageAccToResult(currentPos, steps);
}

console.clear();
const boardLength = +prompt('Enter the length of the board => ');
const noOfLives = +prompt('Enter the number lives=> ');

mineSweeper(boardLength, noOfLives);