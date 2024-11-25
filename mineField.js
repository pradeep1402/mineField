const PLAYER = '🧑‍🦱';
const GREEN_BLOCK = '🟩';

const LINE_BREAK = '\n';
const START_POINT = '⬅️ start';

const FORWARD = 'w';
const LEFT = 'a';
const RIGHT = 'd';
const BACKWARD = 's';

const MOVE_MESSAGE = 'To move W to ⬆️ | A to ⬅️ | S to ⬇️ | D to ➡️ :';

function isDivisible(dividend, divisor) {
  return dividend % divisor === 0;
}

function mineBoard(length, playerPos) {
  let board = '';
  const numberOfCells = length * length;

  for (let index = 1; index <= numberOfCells; index++) {
    board += playerPos === index ? PLAYER : GREEN_BLOCK;

    if (index === numberOfCells) {
      board += START_POINT;
    }

    board += isDivisible(index, length) ? LINE_BREAK : '';
  }

  return board;
}

function convertToLowerCase(letter) {
  if (letter === 'W' || letter === 'w') return 'w';
  if (letter === 'A' || letter === 'a') return 'a';
  if (letter === 'S' || letter === 's') return 's';
  if (letter === 'D' || letter === 'd') return 'd';

  return letter;
}

function inputForMove() {
  return prompt(MOVE_MESSAGE);
}

function moveForward(length, currentPos) {
  return currentPos <= length ? currentPos : currentPos - length;
}

function moveLeftOrRight(length, curPostion, isLeft) {
  const reminder = curPostion % length;

  if (isLeft) {
    return reminder === 1 ? curPostion : curPostion - 1;
  }

  return reminder ? curPostion + 1 : curPostion;
}

function moveBackward(length, currentPos) {
  const isMoveValid = currentPos > Math.pow(length, 2) - length;

  return isMoveValid ? currentPos : currentPos + length;
}

function controller(move, currentPos, length) {
  switch (convertToLowerCase(move)) {
    case FORWARD:
      return moveForward(length, currentPos);

    case LEFT:
      return moveLeftOrRight(length, currentPos, true);

    case RIGHT:
      return moveLeftOrRight(length, currentPos, false);

    case BACKWARD:
      return moveBackward(length, currentPos);

    default:
      console.clear();
      console.log(mineBoard(length, currentPos));
      console.log('Please enter a valid input...');
      const validChar = inputForMove();
      return controller(validChar, currentPos, length);
  }
}

function randomPos() {
  return Math.floor(Math.random() * 3) + 1;
}

function posOfMine(isValidL, isValidR, isValidU, isValidD, curPostion, length) {
  const leftPosIndex = moveLeftOrRight(length, curPostion, true);
  const rightPosIndex = moveLeftOrRight(length, curPostion, false);
  const upPosIndex = moveForward(curPostion, length);
  const downPosIndex = moveBackward(curPostion, length);

  if (isValidL && isValidR) {
    const rightOrLeftIndex = randomPos() === 1 ? leftPosIndex : rightPosIndex;
    if (isValidU) {
      return randomPos() === 1 ? upPosIndex : rightOrLeftIndex;
    }

    return randomPos() === 1 ? downPosIndex : rightOrLeftIndex;
  }

  if (isValidU && isValidD) {
    const upOrDownIndex = randomPos() === 1 ? upPosIndex : downPosIndex;
    if (isValidL) {
      return randomPos() === 1 ? leftPosIndex : upOrDownIndex;
    }

    return randomPos() === 1 ? rightPosIndex : upOrDownIndex;
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

function getRandomIndex(currentPos, length, lastPos) {
  const rowIndex = (length * length) - length;
  const isValidD = !(currentPos > rowIndex) && currentPos + length !== lastPos;
  const isValidL = currentPos % length !== 1 && currentPos - 1 !== lastPos;
  const isValidR = currentPos % length !== 0 && currentPos + 1 !== lastPos;
  const isValidU = !(currentPos <= length) && currentPos - length !== lastPos;

  return posOfMine(isValidL, isValidR, isValidU, isValidD, currentPos, length);
}

function isSubStringFound(subString, string, index) {
  for (let subStrIndex = 0; subStrIndex < subString.length; subStrIndex++) {
    if (string[subStrIndex + index] !== subString[subStrIndex]) {
      return false;
    }
  }

  return true;
}

function isSubstring(string, subString) {
  if (subString === "") {
    return false;
  }

  for (let index = 0; index < string.length; index++) {
    if (isSubStringFound(subString, string, index)) {
      return true;
    }
  }

  return false;
}

function getRandomSafePath(length) {
  let currentPos = length * length;
  let lastPos = currentPos;
  let path = ' ' + currentPos + ' ';

  while (currentPos !== 1) {
    const nextPos = getRandomIndex(currentPos, length, lastPos);
    if (!isSubstring(path, ' ' + nextPos + ' ')) {
      lastPos = currentPos;
      currentPos = nextPos;
      path += currentPos + ' ';
    }
  }
  
  return path;
}

function isInputValid(length, chances) {
  console.clear();
  if (length * length < chances) {
    console.log('Sorry, you have entered more chances than boxes.');
    return false;
  }

  if (chances < 5 || length < 5) {
    console.log('Input number seems to be lesser than required. Chances and length both should be more than 4.');
    return false;
  }

  if (isNaN(length) || isNaN(chances)) {
    console.log('Input is not number.');
    return false;
  }

  return true;
}

function messageAccToResult(currentPos, steps) {
  if (currentPos > 1) {
    return 'Yehe you lose... 🥲😓\nBetter luck next time...';
  }

  return 'Wooohoo! You win... 🤩🏆🥇\nYou took ' + steps + ' steps.';
}

function hintMessage(chances) {
  console.log('You have only ' + chances + ' chances left.');
  console.log('There is a mine...💥💥💣');
}

function calChances(chances) {
  chances--;
  hintMessage(chances);
  return chances;
}

function mineFieldSetup(length, chances, currentPos) {
  let steps = 0;
  let lastPos = currentPos;
  
  while (currentPos !== 1 && chances) {
    console.clear();
    const mineAt = getRandomIndex(currentPos, length, lastPos);
    console.log(mineBoard(length, currentPos));
    const move = inputForMove();
    currentPos = controller(move, currentPos, length);
    steps++;

    if (mineAt === currentPos && mineAt !== 1) {
      chances = calChances(chances);
      currentPos = lastPos;
    }
  }

  console.log(mineBoard(length, currentPos));
  return messageAccToResult(currentPos, steps);
}

function gameInfo() {
  const game = "\n\t\t💣 MINE FIELD 💣\n";
  const goal = "\n Your goal is to reach the top left corner ↖️ ";
  const currPos = "\n " + PLAYER + " represents your current Position. \n";

  return game + goal + currPos;
}

function startGame(length, chances) {
  if (!isInputValid(length, chances)) return;

  let currentPos = length * length;
  return mineFieldSetup(length, chances, currentPos);
}

console.clear();
console.log(gameInfo());
const boardLength = +prompt(' Enter the length of the board => ');
const noOfLives = +prompt(' Enter the number lives=> ');

console.log(startGame(boardLength, noOfLives));