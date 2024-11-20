const WHITE_BLOCK = '🧑‍🦱';
const BLUE_BLOCK = '🟦';
const BOMB = '💣';

function mineBoard(length, mine, playerPos) {
  let board = '';
  let currentPos = 0;

  for (let objLine = 0; objLine < length; objLine++) {
    for (let obj = 0; obj < length; obj++) {
      currentPos++;
      // board += playerPos === currentPos ? WHITE_BLOCK : BLUE_BLOCK;
      if (playerPos === currentPos) {
        if (playerPos === mine) {
          board += BOMB;
        } else {
          board += WHITE_BLOCK;
        }
      } else {
        board += BLUE_BLOCK;
      }
    }
    board += '\n';
  }

  return board;
}

function controler(char, currentPos, length) {
  switch (char) {
    case 'W':
    case 'w':
      return currentPos <= length ? currentPos : currentPos - length;
    case 'A':
    case 'a':
      return currentPos % length === 1 ? currentPos : currentPos - 1;
    case 'D':
    case 'd':
      return currentPos % length === 0 ? currentPos : currentPos + 1;
    case 'S':
    case 's':
      return currentPos > (length * length) - length ? currentPos : currentPos + length;
    default:
      const validChar = prompt('Please enter a valid input...');
      return controler(validChar, currentPos, length);
  }
}

function isInputValid(length, mine) {
  console.clear();
  if (length * length * (2 / 5) <= mine) {
    console.log('Sorry, you have entered more mines than boxes.');
    return false;
  }

  if (mine === 0 || length === 1) {
    console.log('Input number seems to be lesser than required. Mines should be more than 1 and spaces should be more than 1.');
    return false;
  }

  if (isNaN(length) || isNaN(mine)) {
    console.log('Input is not number.');
    return false;
  }

  return true
}

function mineSweeper(length, mine) {
  if (!isInputValid(length, mine)) {
    return;
  }
  let currentPos = length * length;
  while (true) {
    console.log(mineBoard(length, mine, currentPos));
    const charToControl = prompt('Enter W to ⬆️ , A to ⬅️ , and D to ➡️ :');
    console.log('\n');
    currentPos = controler(charToControl, currentPos, length);
    if (currentPos === 1) {
      break;
    }
  }

}

console.clear();
const boardLength = +prompt('Enter the length of the board => ');
const mine = +prompt('Enter the number mines=> ');

mineSweeper(boardLength, mine);