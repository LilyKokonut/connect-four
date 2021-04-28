/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH;
let HEIGHT;
const form = document.querySelector("form");
form.addEventListener("click", formSubmit);

function formSubmit(e){
    if (e.target.type === "button"){
      e.preventDefault();
      WIDTH = parseInt(document.getElementById("width").value) || 6;
      HEIGHT = parseInt(document.getElementById("height").value) ||6;
      if (WIDTH >= 4 && WIDTH <= 15 && HEIGHT >= 4 && HEIGHT <= 15){
        // e.target.parentElement.classList.add("hidden");
        makeBoard();
        makeHtmlBoard();
        e.target.parentElement.innerHTML = '';
        
      } else {
        alert("Oh no! It looks like something is wrong with your game dimension:(  please try again and make sure the dimension is no larger than 15 x 15 and no less than 4 x 4");
        form.reset();
      }
    }
}

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/* makeBoard: create in-JS board structure:
board = array of rows, each row is array of cells  (board[y][x]) */
function makeBoard() {
    for (let i = 0; i < HEIGHT; i++){
    let row = [];
      for (let j = 0; j < WIDTH; j++){
        row.push(null);
      }
      board.push(row);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {

  const htmlBoard = document.getElementById("board");
  // create a tr element at the top of the html table
  // representing a clickable row whose dimension matches the board
  // create certtain amount of td elements in this tr element,
  // representing cells in this row with ID "column"
  // add a click event to each of the cell 
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  // create an in-html board structure,
  // table element represents the gameboard, 
  // each tr element represents a row on gameboard
  // each td element represents a cell in a row with ID "row-column"
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      cell.classList.add("cell");
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  for(let y = 0; y < HEIGHT; y++){
    if ( !board[HEIGHT-1][x]) return HEIGHT - 1;
    if (board[y][x] && y === 0) {
      return null;
    } else if (board[y][x]){
      return y - 1;
    }
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  let curCell = document.getElementById(`${y}-${x}`);
  let piece = document.createElement("div");
  piece.classList.add("piece");
  piece.style.transform = "translateY(" + -50 * (y + 2) + "px" + ")";
 
  if (currPlayer === 1) {
    piece.classList.add("p1");
  }else {
    piece.classList.add("p2");
  }
  curCell.classList.add("filled");
  curCell.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(`${msg}`);
  let headCell = document.querySelector("#column-top");
  headCell.removeEventListener("click", handleClick);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  // get x from ID of clicked cell
  let x = evt.target.id;
  x = parseInt(x);
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);

  if (y === null) return;
  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer === 1 ? 1 : 2;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if( board[0].every(val => (val))) {
    endGame(`We have no winner today.`);
  }

  // switch players
  currPlayer = currPlayer === 1 ?  2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  // function _win(cells) {
  //   // Check four cells to see if they're all color of current player
  //   //  - cells: list of four (y, x) cells
  //   //  - returns true if all are legal coordinates & all match currPlayer

  //   return cells.every(
  //     ([y, x]) =>
  //       y >= 0 &&
  //       y < HEIGHT &&
  //       x >= 0 &&
  //       x < WIDTH &&
  //       board[y][x] === currPlayer
  //   );
  // }

  // // TODO: read and understand this code. Add comments to help you.

  // for (let y = 0; y < HEIGHT; y++) {
  //   for (let x = 0; x < WIDTH; x++) {
  //     let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
  //     let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
  //     let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
  //     let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

  //     if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
  //       return true;
  //     }
  //   }
  // }

  // let tie = [null, null, null, null];
  // find the first cell which is not empty

  for (let b = 0;  b < HEIGHT; b++){
    for (let a = 0; a < WIDTH; a++){

      let dir1;
      let dir2;
      let dir3;
      let dir4;

      try {
        dir1 = [board[a][b], board[a][b+1], board[a][b+2], board[a][b+3]];
      } catch (TypeError){
         dir1 = [null];
      }

      try {
        dir2 = [board[a][b], board[a+1][b-1], board[a+2][b-2], board[a+3][b-3]];
      } catch (TypeError){
         dir2 = [null];
      }

      try {
        dir3 = [board[a][b], board[a+1][b], board[a+2][b], board[a+3][b]];
      } catch (TypeError){
         dir3 = [null];
      }

      try {
        dir4 = [board[a][b], board[a+1][b+1], board[a+2][a+2], board[a+3][a+3]];
      } catch (TypeError){
         dir4 = [null];
      }

      let allDirs = [dir1, dir2, dir3, dir4];
      let tie = allDirs.find(dir => dir.every(val => val === 1)) ||
                      allDirs.find(dir => dir.every(val => val === 2));
        if (tie){
          return tie;
        }
      
    }
  }

}

