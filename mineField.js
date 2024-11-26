const PLAYER = '🧑‍🦱';
const GREEN_BLOCK = '🟩';
const WHITE_BLOCK = '⬜';

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

function isSubstringFound(subString, string, index) {
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
    if (isSubstringFound(subString, string, index)) {
      return true;
    }
  }

  return false;
}

function getColourBox(index, previousPos) {
  return index === previousPos ? WHITE_BLOCK : GREEN_BLOCK;
}

function mineBoard(length, playerPos, previousPos) {
  let board = '';
  const numberOfCells = length * length;

  for (let index = 1; index <= numberOfCells; index++) {
    board += playerPos === index ? PLAYER : getColourBox(index, previousPos);

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

function moveForward(length, playerPos) {
  return isValidUp(playerPos, length) ? playerPos - length : playerPos;
}

function moveLeftOrRight(length, curPostion, isLeft) {
  if (isLeft) {
    return isValidLeft(curPostion, length) ? curPostion - 1 : curPostion;
  }

  return isValidRight(curPostion, length) ? curPostion + 1 : curPostion;
}

function moveBackward(length, playerPos) {
  return isValidDown(playerPos, length) ? playerPos + length : playerPos;
}

function invalidControlInput(playerPos, length, previousPos) {
  console.clear();
  console.log(mineBoard(length, playerPos, previousPos));
  console.log('Please enter a valid input...');
  const validChar = prompt(MOVE_MESSAGE);
  return controller(validChar, playerPos, length);
}

function controller(move, playerPos, length, previousPos) {
  switch (convertToLowerCase(move)) {
    case FORWARD:
      return moveForward(length, playerPos);

    case LEFT:
      return moveLeftOrRight(length, playerPos, true);

    case RIGHT:
      return moveLeftOrRight(length, playerPos, false);

    case BACKWARD:
      return moveBackward(length, playerPos);

    default:
      return invalidControlInput(playerPos, length, previousPos);
  }
}

function randomPos() {
  return Math.ceil(Math.random() * 3);
}

function nextSafePos(isValidDir1, isValidDir2, isValidDir3, currentPos, length) {
  const leftPos = moveLeftOrRight(length, currentPos, true);
  const rightPos = moveLeftOrRight(length, currentPos, false);
  const upPos = moveForward(length, currentPos);
  const downPos = moveBackward(length, currentPos);

  if (isValidDir2) {
    const rOrLPos = randomPos() === 1 ? leftPos : rightPos;

    if (isValidDir3) {
      return randomPos() === 1 ? upPos : rOrLPos;
    } else if (isValidDir1) {
      return randomPos() === 1 ? downPos : rOrLPos;
    }

    return rOrLPos;
  }

  return leftPos;
}

function nextSafeIndex(isValidL, isValidR, isValidU, isValidD, currentPos, length) {
  switch (true) {
    case isValidL:
      return nextSafePos(isValidD, isValidR, isValidU, currentPos, length);

    case isValidD:
      return nextSafePos(isValidR, isValidL, isValidU, currentPos, length);

    case isValidR:
      return nextSafePos(isValidD, isValidL, isValidU, currentPos, length);

    default:
      return nextSafePos(isValidD, isValidL, isValidR, currentPos, length);
  }
}

function isValidDown(playerPos, length) {
  const bottomLeftIndex = length * (length - 1);
  return !(playerPos > bottomLeftIndex);
}

function isValidUp(playerPos, length) {
  return !(playerPos <= length)
}

function isValidLeft(playerPos, length) {
  return playerPos % length !== 1
}

function isValidRight(playerPos, length) {
  return !isDivisible(playerPos, length);
}

function getRandomIndex(playerPos, length) {
  const isValidD = isValidDown(playerPos, length);
  const isValidL = isValidLeft(playerPos, length);
  const isValidR = isValidRight(playerPos, length);
  const isValidU = isValidUp(playerPos, length);

  return nextSafeIndex(isValidL, isValidR, isValidU, isValidD, playerPos, length);
}

function getPath(length) {
  let playerPos = length * length;
  let previousPos = playerPos;
  let path = ' ' + playerPos + ' ';

  while (playerPos !== 2 && playerPos !== length + 1) {
    const nextPos = getRandomIndex(playerPos, length, previousPos);
    previousPos = playerPos;
    playerPos = nextPos;

    if (!isSubstring(path, ' ' + nextPos + ' ')) {
      path += playerPos + ' ';
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

function messageAccToResult(playerPos, steps) {
  if (playerPos > 1) {
    return 'Yehe you lost... 🥲😓\nBetter luck next time...';
  }

  return 'Wooohoo! You won... 🤩🏆🥇\nYou took ' + steps + ' steps.';
}

function hintMessage(chances) {
  console.log('You have only ' + chances + ' chances left.');
  console.log('There is a mine...💥💥💣');
  confirm('Press Enter to proceed:');
}

function displayMineFiels(length, playerPos, previousPos) {
  console.clear();
  console.log(mineBoard(length, playerPos, previousPos));
}

function moveInput(playerPos, length, previousPos) {
  const move = prompt(MOVE_MESSAGE);
  return controller(move, playerPos, length, previousPos);

}

function isGameOver(playerPos, chances, previousPos, length) {
  displayMineFiels(length, playerPos, previousPos);
  return playerPos !== 1 && chances
}

function isMineFound(path, playerPos) {
  return !isSubstring(path, ' ' + playerPos + ' ') && playerPos !== 1;
}

function mineField(length, chances, playerPos) {
  let steps = 0;
  let previousPos = playerPos;
  const path = getPath(length);

  while (isGameOver(playerPos, chances, previousPos, length)) {
    displayMineFiels(length, playerPos, previousPos);
    const nextPos = moveInput(playerPos, length, previousPos);
    steps++;
    previousPos = playerPos;
    playerPos = nextPos;

    if (isMineFound(path, playerPos)) {
      chances--;
      hintMessage(chances);
      playerPos = length * length;
    }
  }

  return messageAccToResult(playerPos, steps);
}

function gameDetails() {
  const game = '\n\t\t💣 MINE FIELD 💣\n';
  const goal = '\n Your goal is to reach the top left corner ↖️ ';
  const rules = '\n Minimus length and chances are five.'
  const currPos = '\n " + PLAYER + " represents your current Position. \n';

  return game + goal + rules + currPos;
}

function startGame() {
  console.clear();
  console.log(gameDetails());
  const length = +prompt(' Enter the length of the board => ');
  const chances = +prompt(' Enter the number chances=> ');

  if (!isInputValid(length, chances)) {
    return startGame();
  }

  const playerPos = length * length;
  return mineField(length, chances, playerPos);
}


console.log(startGame());