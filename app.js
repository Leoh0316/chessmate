const game = new Chess();
let board = null;

function customPieceTheme(piece) {
  // 네가 만든 이미지명과 연결
  const color = piece[0] === 'w' ? 'White' : 'Black';
  const types = { p:'Pawn', r:'Rook', n:'Knight', b:'Bishop', q:'Queen', k:'King' };
  let type = types[piece[1].toLowerCase()];
  return type ? `${color}${type}.png` : '';
}

function onDragStart(source, piece) {
  if (game.game_over()) return false;
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) return false;
}

function onDrop(source, target) {
  const move = game.move({ from: source, to: target, promotion: 'q' });
  if (move === null) return 'snapback';
  updateStatus();
}

function highlightSquares(squares) {
  removeHighlights();
  squares.forEach(sq => {
    document.querySelector('.square-' + sq).classList.add('highlight');
  });
}

function removeHighlights() {
  document.querySelectorAll('.square-55d63.highlight').forEach(el => el.classList.remove('highlight'));
}

function onMouseoverSquare(square, piece) {
  if (!piece) return;
  const moves = game.moves({ square: square, verbose: true });
  if (moves.length === 0) return;
  highlightSquares(moves.map(m => m.to));
}

function onMouseoutSquare(square, piece) {
  removeHighlights();
}

function updateStatus() {
  let status = '';
  if (game.in_checkmate()) status = '체크메이트! 게임 끝!';
  else if (game.in_stalemate()) status = '스테일메이트 무승부!';
  else if (game.in_check()) status = (game.turn() === 'w' ? '백' : '흑') + ' 차례 - 체크 중';
  else status = (game.turn() === 'w' ? '백' : '흑') + ' 차례';

  document.getElementById('status').textContent = status;
}

function startGame() {
  game.reset();
  board.start();
  updateStatus();
}

// board config
const config = {
  draggable: true,
  position: 'start',
  pieceTheme: customPieceTheme,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoverSquare: onMouseoverSquare,
  onMouseoutSquare: onMouseoutSquare,
};

window.addEventListener('load', () => {
  board = Chessboard('board', config);
  updateStatus();
  document.getElementById('startBtn').addEventListener('click', startGame);
});