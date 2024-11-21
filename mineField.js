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

function posOfMine(isValidL, isValidR, isValidU, isValidD, curPostion, length) {
  const leftPosIndex = curPostion - 1;
  const rightPosIndex = curPostion + 1;
  const upPosIndex = curPostion - length;
  const downPosIndex = curPostion + length;

  if (isValidL && isValidR) {
    const selectRightOrLeft = randomPos() === 1 ? leftPosIndex : rightPosIndex;
    if (isValidU) {
      return randomPos() === 1 ? upPosIndex : selectRightOrLeft;
    }
    return randomPos() === 1 ? downPosIndex : selectRightOrLeft;
  }

  if (isValidU && isValidD) {
    const selectUpOrDown = randomPos() === 1 ? upPosIndex : downPosIndex;
    if (isValidL) {
      return randomPos() === 1 ? leftPosIndex : selectUpOrDown;
    }
    return randomPos() === 1 ? rightPosIndex : selectUpOrDown;
  }

  if (isValidR) {
    if (isValidD) {
      return randomPos() === 1 ? downPosIndex : rightPosIndex;
    }
    return randomPos() === 1 ? upPosIndex : rightPosIndex;
  }

  if (isValidL) {
    if (isValidD) {
      return randomPos() === 1 ? downPosIndex : leftPosIndex;
    }
    return randomPos() === 1 ? upPosIndex : leftPosIndex;
  }
}

function getMinePosition(currentPos, length, lastPos) {
  const rowIndex = (length * length) - length;
  const isValidD = !(currentPos > rowIndex) && currentPos + length !== lastPos;
  const isValidL = !(currentPos % length === 1) && currentPos - 1 !== lastPos;
  const isValidR = !(currentPos % length === 0) && currentPos + 1 !== lastPos;
  const isValidU = !(currentPos <= length) && currentPos - length !== lastPos;

  return posOfMine(isValidL, isValidR, isValidU, isValidD, currentPos, length);
}

function messageAccToResult(currentPos, steps) {
  if (currentPos > 1) {
    console.log('Yehe you lose... 🥲😓\nBetter luck next time...');
    return;
  }
  console.log('Wooohoo! You win... 🤩🏆🥇\nYou took ' + steps + ' steps.')
}

function delayMessage(chances, len) {
  console.clear();
  console.log('You have only ' + chances + ' chances left.');
  console.log('There is a mine...💥💥💣');
  for (let i = 0; i < len * 300000000; i++) { }
}

function calChances(chancesLeft, length) {
  chancesLeft--;
  delayMessage(chancesLeft, length);
  return chancesLeft;
}

function mineFieldSetup(length, noOfLives) {
  let chancesLeft = noOfLives;
  let currentPos = length * length;
  let lastPos = currentPos;
  let steps = 0;
  while (!(currentPos === 1)) {
    lastPos = currentPos;
    const mineAt = getMinePosition(currentPos, length, lastPos);
    console.log(mineBoard(length, currentPos, mineAt));
    const charToControl = prompt('Move W to ⬆️ , A to ⬅️ , S to ⬇️ and D to ➡️ :');
    currentPos = controler(charToControl, currentPos, length);
    steps++;
    if (mineAt === currentPos && !(mineAt === 1)) {
      chancesLeft = calChances(chancesLeft, length, lastPos);
      currentPos = lastPos;
      if (chancesLeft === 0) return;
    }
    console.log('\n');
  }
  console.log(mineBoard(length, currentPos));
  messageAccToResult(currentPos, steps);
}

function mineField(length, noOfLives) {
  if (!isInputValid(length, noOfLives)) return;

  return mineFieldSetup(length, noOfLives);
}

console.clear();
const boardLength = +prompt('Enter the length of the board => ');
const noOfLives = +prompt('Enter the number lives=> ');

mineField(boardLength, noOfLives);