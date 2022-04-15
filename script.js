// Display/UI
import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
} from "./minesweeper.js";

const BOARD_WIDTH = 30;
const BOARD_HEIGHT = 16;
const NUMBER_OF_MINES = 50;

const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT, NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");
const minesLeftText = document.querySelector("[data-mine-count]");
const messageText = document.querySelector(".subtext");

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element);
    tile.element.addEventListener("click", () => {
      revealTile(board, tile);
      checkGameEnd();
    });
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      markTile(tile);
      s;
      listMinesLeft();
    });
  });
});
boardElement.style.setProperty("--width", BOARD_WIDTH);
boardElement.style.setProperty("--height", BOARD_HEIGHT);
minesLeftText.textContent = NUMBER_OF_MINES;

function listMinesLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TILE_STATUSES.FLAGGED).length
    );
  }, 0);
  minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount;
}

function checkGameEnd() {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true });
    boardElement.addEventListener("contextmenu", stopProp, { capture: true });
  }

  if (win) {
    messageText.textContent = "You win!";
  }

  if (lose) {
    messageText.textContent = "You lose! Try again?";
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.FLAGGED && !tile.mine) {
          tile.status = TILE_STATUSES.WRONGFLAGED;
        }
        if (tile.status === TILE_STATUSES.FLAGGED) markTile(tile);
        if (tile.mine) {
          tile.element.innerText = "💣";
          revealTile(board, tile);
        }
      });
    });
  }
}

function stopProp(e) {
  e.stopImmediatePropagation();
}
