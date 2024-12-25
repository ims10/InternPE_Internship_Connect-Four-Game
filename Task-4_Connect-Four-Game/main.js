const popup = document.getElementById('popup');
const startBtn = document.getElementById('start-btn');
const gameContainer = document.getElementById('game-container');
const board = document.getElementById('board');
const status = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');

const rows = 6;
const cols = 7;
let currentPlayer = 1;
let gameBoard = Array(rows).fill(null).map(() => Array(cols).fill(0));
let gameOver = false;

popup.style.display = 'block';

startBtn.addEventListener('click', () => {
  popup.style.display = 'none';
  gameContainer.style.display = 'flex';
  initBoard();
});

resetBtn.addEventListener('click', resetGame);

function initBoard() {
  board.innerHTML = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', handleCellClick);
      board.appendChild(cell);
    }
  }
}

function handleCellClick(e) {
  if (gameOver) return;

  const col = parseInt(e.target.dataset.col);
  for (let r = rows - 1; r >= 0; r--) {
    if (gameBoard[r][col] === 0) {
      gameBoard[r][col] = currentPlayer;
      const cell = board.querySelector(`[data-row='${r}'][data-col='${col}']`);
      cell.classList.add(`player${currentPlayer}`);

      if (checkWin(r, col)) {
        status.innerHTML = ` &#128226; Player ${currentPlayer} wins!!!&#127941;`;
        highlightWinningCells(r, col);
        gameOver = true;
        return;
      }

      currentPlayer = currentPlayer === 1 ? 2 : 1;
      status.textContent = `Player ${currentPlayer}'s turn`;
      return;
    }
  }
}

function checkWin(row, col) {
  const directions = [
    [[0, 1], [0, -1]], // Horizontal
    [[1, 0], [-1, 0]], // Vertical
    [[1, 1], [-1, -1]], // Diagonal \
    [[1, -1], [-1, 1]]  // Diagonal /
  ];

  for (const direction of directions) {
    let count = 1;
    let winningCells = [[row, col]];
    for (const [dr, dc] of direction) {
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < rows && c >= 0 && c < cols && gameBoard[r][c] === currentPlayer) {
        count++;
        winningCells.push([r, c]);
        r += dr;
        c += dc;
      }
    }
    if (count >= 4) {
      highlightWinningCells(winningCells);
      return true;
    }
  }
  return false;
}

function highlightWinningCells(cells) {
  cells.forEach(([r, c]) => {
    const cell = board.querySelector(`[data-row='${r}'][data-col='${c}']`);
    if (cell) cell.classList.add('winning');
  });
}

function resetGame() {
  gameBoard = Array(rows).fill(null).map(() => Array(cols).fill(0));
  currentPlayer = 1;
  gameOver = false;
  status.textContent = "Player 1's turn";
  initBoard();
}
