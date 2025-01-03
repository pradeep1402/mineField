const PLAYER = '🧑‍🦱';
const GREEN_BLOCK = '🟩';
const WHITE_BLOCK = '⬜';

const LINE_BREAK = '\n';
const START_POINT = '⬅️ start';

const UP = 'w';
const LEFT = 'a';
const RIGHT = 'd';
const DOWN = 's';

const MOVE_MESSAGE = 'To move W to ⬆️ | A to ⬅️ | S to ⬇️ | D to ➡️ :';

function isDivisible(dividend, divisor) {
  return dividend % divisor === 0;
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

function displayMineBoardWithPath(length, path) {
  let board = '';
  const numberOfCells = length * length;

  for (let index = 0; index < numberOfCells - 1; index++) {
    board += isDivisible(index, length) ? LINE_BREAK : '';
    board += isElementPresent(path, index) ? WHITE_BLOCK : GREEN_BLOCK;
  }
  console.clear();
  console.log(board + PLAYER + START_POINT);
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
  displayMineFields(length, playerPos, previousPos);
  console.log('Please enter a valid input...');
  const validChar = prompt(MOVE_MESSAGE);

  return controller(validChar, playerPos, length);
}

function controller(move, playerPos, length, previousPos) {
  switch (convertToLowerCase(move)) {
    case UP:
      return moveForward(length, playerPos);

    case LEFT:
      return moveLeftOrRight(length, playerPos, true);

    case RIGHT:
      return moveLeftOrRight(length, playerPos, false);

    case DOWN:
      return moveBackward(length, playerPos);

    default:
      return invalidControlInput(playerPos, length, previousPos);
  }
}

function randomPos() {
  return Math.ceil(Math.random() * 3);
}

function nextSafePos(isValidDir1, isValidDir2, isValidDir3, currentPos, length) {
  const leftPosition = moveLeftOrRight(length, currentPos, true);
  const rightPosition = moveLeftOrRight(length, currentPos, false);
  const upPosition = moveForward(length, currentPos);
  const downPosition = moveBackward(length, currentPos);
  const leftOrRightPos = randomPos() === 1 ? leftPosition : rightPosition;

  if (isValidDir2) {

    if (isValidDir3) {
      return randomPos() === 1 ? upPosition : leftOrRightPos;
    }

    if (isValidDir1) {
      return randomPos() === 1 ? downPosition : leftOrRightPos;
    }

  }

  return leftOrRightPos;
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

function isElementPresent(path, element) {
  for (let index = 0; index < path.length; index++) {
    if (path[index] === element) {
      return true;
    }
  }

  return false;
}

function getPath(length) {
  let playerPos = length * length;
  let previousPos = playerPos;
  const path = [playerPos];

  while (playerPos !== 2 && playerPos !== length + 1) {
    const nextPos = getRandomIndex(playerPos, length, previousPos);
    previousPos = playerPos;
    playerPos = nextPos;

    if (!isElementPresent(path, playerPos)) {
      path[path.length] = playerPos;
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

function displayMineFields(length, playerPos, previousPos) {
  console.clear();
  console.log(mineBoard(length, playerPos, previousPos));
}

function moveInput(playerPos, length, previousPos) {
  const move = prompt(MOVE_MESSAGE);

  return controller(move, playerPos, length, previousPos);
}

function isGameOver(playerPos, chances, previousPos, length) {
  displayMineFields(length, playerPos, previousPos);
  return playerPos !== 1 && chances
}

function isMineFound(path, playerPos) {
  return !isElementPresent(path, playerPos) && playerPos !== 1;
}

function mineField(length, chances) {
  let steps = 0;
  let playerPos = length * length;
  let previousPos = playerPos;
  const path = getPath(length);

  while (isGameOver(playerPos, chances, previousPos, length)) {
    displayMineFields(length, playerPos, previousPos);
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

  displayMineBoardWithPath(length, path);
  return messageAccToResult(playerPos, steps);
}

function gameDetails() {
  const game = '\n\t\t💣 MINE FIELD 💣\n';
  const goal = '\n Your goal is to reach the top left corner ↖️ ';
  const rules = '\n Minimum size and chances should be five.'
  const currPos = '\n ' + PLAYER + ' represents your current Position. \n';

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

  return mineField(length, chances);
}

console.log(startGame());