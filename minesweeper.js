//Logic

export const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  FLAGGED: "flagged",
  NUMBER: "number",
  QUESTION: "question",
  WRONGFLAGED: "wrongflagged",
};

export function createBoard(boardWidth, boardHeight, numberOfMines) {
  const board = [];
  const minePositions = getMinePositions(
    boardWidth,
    boardHeight,
    numberOfMines
  );
  for (let y = 0; y < boardHeight; y++) {
    const row = [];
    for (let x = 0; x < boardWidth; x++) {
      const element = document.createElement("div");
      element.dataset.status = TILE_STATUSES.HIDDEN;
      const tile = {
        element,
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })), //check to see if the mine position matches the current tile
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };
      row.push(tile);
    }
    board.push(row);
  }
  return board;
}

export function markTile(tile) {
  if (
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.FLAGGED
  ) {
    return;
  }
  tile.status === TILE_STATUSES.FLAGGED
    ? ((tile.status = TILE_STATUSES.HIDDEN), (tile.element.innerText = ""))
    : ((tile.status = TILE_STATUSES.FLAGGED), (tile.element.innerText = "🚩"));
}

//Reveal tile
export function revealTile(board, tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) return;
  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE;
    tile.element.innerText = "💣";
    return;
  }

  tile.status = TILE_STATUSES.NUMBER;
  const adjacentTiles = nearbyTiles(board, tile);
  const mines = adjacentTiles.filter((t) => t.mine); //Filter out all the tiles with mines in the adjacent tiles
  if (mines.length === 0) {
    //Checks the adjacent tiles and reveals them if they are not mines then check the adjacent again
    adjacentTiles.forEach(revealTile.bind(null, board)); //recursive function
  } else {
    tile.element.textContent = mines.length; //Show number if there are adjacent mines
  }
}

export function checkWin(board) {
  return board.every((row) => {
    return row.every((tile) => {
      return (
        //If all tile is revealed
        tile.status === TILE_STATUSES.NUMBER ||
        //If tile with mine is either hidden or flagged
        (tile.mine && tile.status === TILE_STATUSES.HIDDEN) ||
        tile.status === TILE_STATUSES.FLAGGED
      );
    });
  });
}

export function checkLose(board) {
  return board.some((row) => {
    return row.some((tile) => {
      return tile.status === TILE_STATUSES.MINE;
    });
  });
}

//Check position of mines
function getMinePositions(boardWidth, boardHeight, numberOfMines) {
  const minePositions = [];
  while (minePositions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardWidth),
      y: randomNumber(boardHeight),
    };
    //bind 'position' to A, then loop through minePositions as B
    if (!minePositions.some(positionMatch.bind(null, position))) {
      minePositions.push(position);
    }
  }
  return minePositions;
}

function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}

function randomNumber(size) {
  return Math.floor(Math.random() * size);
}

function nearbyTiles(board, { x, y }) {
  const tiles = []; //array to store adjacent tiles
  for (let yOffset = -1; yOffset <= 1; yOffset++) {
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      const adjTile = board[y + yOffset]?.[x + xOffset];
      if (adjTile) tiles.push(adjTile); //if tile exists, push it to tiles, if not, then it must be out of bounds
    }
  }
  return tiles; //return an array of nearby tiles
}
