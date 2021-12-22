// tried to keep ux simple
//  - current player is indicated by color of disc on hover
//  - winner is also indicated by color and text
//
// instead of inserting divs, i thought it was simpler to change td class
//
// board [column][row] or [y][x]

// board dimensions
const WIDTH = 7;
const HEIGHT = 6;

// initialize player and board
let currPlayer = 1;
let board = [];

// initialize empty board array
const makeBoard = () => (board = [...Array(HEIGHT)].map(() => Array(WIDTH).fill(0)));


function displayBoard() {

  // display board - fills from bottom to top
  const htmlBoard = document.getElementById('board');
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      cell.className = "empty";
      row.append(cell);
    }
    htmlBoard.prepend(row);
  }

  // display header row
  document.getElementById("toprow").addEventListener("click",handleClick);
  const top = document.createElement("tr");
  // top.addEventListener("click", handleClick);
  for (let x = 0; x < WIDTH; x++) {
    let cell = document.createElement("td");
    cell.setAttribute("id", x);
    cell.className = "empty";
    cell.addEventListener("mouseenter", mouseEnter);
    cell.addEventListener("mouseleave", mouseLeave);
    top.append(cell);
  }
  document.getElementById('toprow').append(top);

}

function mouseEnter(e) { e.target.className = "p" + currPlayer }

function mouseLeave(e) { e.target.className = "empty" }

function nextEmptySpot(x) {
  for (let y = 0; y < HEIGHT; y++) { if (board[y][x] == 0) { return y } }
  return 'full';
}

function makeMove(y, x) {

  // update board array
  board[y][x] = currPlayer;

  // update display
  const td = document.getElementById(`${y}-${x}`);
  td.className = "p" + currPlayer;

  if (checkForWin()) { return endGame('win') }
  if (checkForTie()) { return endGame('tie') }

  // switch current player
  currPlayer = (currPlayer == 1 ? 2 : 1);

}

function endGame(result) {

  // disable gameplay
  document.getElementById("toprow").removeEventListener("click", handleClick);

  // display win message and restart button
  const status =  document.getElementById("status");

  if (result == 'win') {
    status.classList.add(`w${currPlayer}`);
    status.innerHTML = `PLAYER ${currPlayer} HAS WON! `;
  }

  if (result == 'tie') {
    status.innerHTML = `TIE! `;
  }

  const restart = document.createElement("span");
  restart.className = "restart";
  restart.innerHTML = "RESTART";
  restart.addEventListener("click", startGame)

  status.append(restart);

}

function handleClick(e) {

  // get x from ID of clicked cell
  var x = +e.target.id;

  // get next spot in column (if none, ignore click)
  var y = nextEmptySpot(x);
  if (y === 'full') { return }

  makeMove(y, x);

  if (currPlayer == 1) {
    e.target.className = "p1";
  }
  else {
    e.target.className = "p2";
  }

}

function checkForWin() {

  function _win(cells) {

    // if every cell in the array is a valid position, i.e., within the height and width of the board
    // and all value of every position in the array is equal to currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );

  }

  // this loops through every cell, and then makes an array of positions going in horizontal right
  // vertical up, left and right diagonal directions. this will generate some arrays that extend
  // beyond the board boundaries, but _win function will check for that
  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // each of these position arrays is checked via previous win function
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

function checkForTie() { return board.every( r => r.every( c => c != 0 )) }

function startGame() {
  currPlayer = 1;
  const status = document.getElementById("status");
  status.className = "";
  status.innerHTML = "CONNECT FOUR";
  document.getElementById("board").innerHTML = "";
  document.getElementById("toprow").innerHTML = "";
  makeBoard();
  displayBoard();
}


// displays board array in console for comparison to display for testing
// function consoleLogBoard() {
//   for (let y = HEIGHT - 1; y >= 0; y=y-1) {
//     console.log('r' + (y+1) + ': ' + board[y].join(' '));
//   }
// }

startGame();
