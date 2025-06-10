'use client'; // Habilita funcionalidades específicas do Next.js no client-side

import React, { useState } from 'react';
import styles from './page.module.css'; // Importa os estilos do módulo CSS

// Tipos possíveis de peças
type PieceType = 'PO' | 'Dev' | 'Des';
// Tipos de jogadores
type Player = 'white' | 'black';

// Interface representando uma peça do tabuleiro
interface Piece {
  type: PieceType;
  player: Player;
}

// Interface para posição de uma célula (linha e coluna)
interface Position {
  row: number;
  col: number;
}

export default function Home() {
  // Estados principais do jogo
  const [boardWidth, setBoardWidth] = useState(6); // Largura configurável
  const [boardHeight, setBoardHeight] = useState(6); // Altura configurável
  const [currentWidth, setCurrentWidth] = useState(6); // Largura atual em jogo
  const [currentHeight, setCurrentHeight] = useState(6); // Altura atual em jogo
  const [gameStarted, setGameStarted] = useState(true); // Flag de início do jogo
  const [board, setBoard] = useState<(Piece | null)[][]>(() => createInitialBoard(6, 6)); // Tabuleiro
  const [selected, setSelected] = useState<Position | null>(null); // Célula selecionada
  const [validMoves, setValidMoves] = useState<Position[]>([]); // Movimentos válidos
  const [turn, setTurn] = useState<Player>('white'); // Turno atual
  const [winner, setWinner] = useState<Player | null>(null); // Vencedor

  // Valida se tamanho é permitido
  const isValidSize = (w: number, h: number) => w >= 6 && w <= 12 && h >= 6 && h <= 12;

  // Cria o tabuleiro inicial com peças posicionadas
  function createInitialBoard(w: number, h: number) {
    const newBoard: (Piece | null)[][] = Array.from({ length: h }, () =>
      Array.from({ length: w }, () => null)
    );

    // Peças pretas no topo
    newBoard[0][w - 1] = { type: 'PO', player: 'black' };
    newBoard[0][w - 2] = { type: 'Dev', player: 'black' };
    newBoard[0][w - 3] = { type: 'Des', player: 'black' };

    // Peças brancas na base
    newBoard[h - 1][0] = { type: 'PO', player: 'white' };
    newBoard[h - 1][1] = { type: 'Dev', player: 'white' };
    newBoard[h - 1][2] = { type: 'Des', player: 'white' };

    return newBoard;
  }

  // Inicia o jogo com dimensões definidas
  const handleStart = () => {
    if (isValidSize(boardWidth, boardHeight)) {
      setBoard(createInitialBoard(boardWidth, boardHeight));
      setCurrentWidth(boardWidth);
      setCurrentHeight(boardHeight);
      setGameStarted(true);
      setSelected(null);
      setTurn('white');
      setWinner(null);
    }
  };

  // Verifica se a posição está dentro dos limites do tabuleiro
  const inBounds = (pos: Position) =>
    pos.row >= 0 && pos.col >= 0 && pos.row < currentHeight && pos.col < currentWidth;

  // Verifica se uma peça em determinada posição é inimiga
  const isEnemy = (pos: Position, player: Player) => {
    const piece = board[pos.row][pos.col];
    return piece && piece.player !== player;
  };

  // Calcula os movimentos válidos de uma peça
  const getMoves = (pos: Position, piece: Piece): Position[] => {
    const moves: Position[] = [];

    if (piece.type === 'PO') {
      // PO se move 1 casa em qualquer direção
      const dirs = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1],
      ];
      for (const [dr, dc] of dirs) {
        const np = { row: pos.row + dr, col: pos.col + dc };
        if (inBounds(np) && (!board[np.row][np.col] || isEnemy(np, piece.player))) {
          moves.push(np);
        }
      }
    } else if (piece.type === 'Dev') {
      // Dev se move até 3 casas em linha reta ou diagonal
      const dirs = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1],
      ];
      for (const [dr, dc] of dirs) {
        for (let d = 1; d <= 3; d++) {
          const np = { row: pos.row + dr * d, col: pos.col + dc * d };
          if (!inBounds(np)) break;
          if (board[np.row][np.col]) {
            if (isEnemy(np, piece.player)) moves.push(np);
            break;
          }
          moves.push(np);
        }
      }
    } else if (piece.type === 'Des') {
      // Des se move como cavalo (em L)
      const deltas = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1],
      ];
      for (const [dr, dc] of deltas) {
        const np = { row: pos.row + dr, col: pos.col + dc };
        if (inBounds(np) && (!board[np.row][np.col] || isEnemy(np, piece.player))) {
          moves.push(np);
        }
      }
    }

    return moves;
  };

  // Lida com clique no tabuleiro
  const handleClick = (row: number, col: number) => {
    if (winner) return;

    const clicked = board[row][col];
    const pos = { row, col };

    if (selected) {
      // Já existe peça selecionada
      const isMove = validMoves.some(p => p.row === row && p.col === col);
      if (isMove) {
        const newBoard = board.map(r => r.slice());
        const movingPiece = board[selected.row][selected.col];

        if (movingPiece) {
          // Verifica vitória
          if (newBoard[row][col]?.type === 'PO') {
            setWinner(movingPiece.player);
          }
          newBoard[row][col] = movingPiece;
          newBoard[selected.row][selected.col] = null;
        }

        setBoard(newBoard);
        setSelected(null);
        setValidMoves([]);
        setTurn(turn === 'white' ? 'black' : 'white');
      } else {
        // Cancela seleção se clique não for em movimento válido
        setSelected(null);
        setValidMoves([]);
      }
    } else if (clicked && clicked.player === turn) {
      // Seleciona peça se for do jogador atual
      setSelected(pos);
      setValidMoves(getMoves(pos, clicked));
    }
  };

  // Renderiza cada célula do tabuleiro
  const renderCell = (row: number, col: number) => {
    const piece = board[row][col];
    const isLight = (row + col) % 2 === 0;
    const isSel = selected?.row === row && selected?.col === col;
    const isValid = validMoves.some(p => p.row === row && p.col === col);

    const cellClasses = [
      styles.cell,
      isLight ? styles.light : styles.dark,
      isSel ? styles.selected : '',
      isValid ? styles.valid : '',
    ].join(' ');

    // Letras e números no canto da célula
    const coord = (
      <>
        {row === currentHeight - 1 && (
          <span className={styles.colLetter}>{String.fromCharCode(65 + col)}</span>
        )}
        {col === 0 && (
          <span className={styles.rowNumber}>{currentHeight - row}</span>
        )}
      </>
    );

    // Imagem da peça
    const img = piece ? (
      <img
        src={`/${piece.player}-${piece.type.toLowerCase()}.png`}
        alt={`${piece.player} ${piece.type}`}
        width={48}
        height={48}
        draggable={false}
      />
    ) : null;

    return (
      <div
        key={`${row}-${col}`}
        className={cellClasses}
        onClick={() => handleClick(row, col)}
      >
        {coord}
        {img}
      </div>
    );
  };

  // JSX da tela principal
  return (
    <main className={styles.main}>
      {gameStarted && (
        <div
          className={styles.board}
          style={{
            gridTemplateColumns: `repeat(${currentWidth}, 64px)`,
            gridTemplateRows: `repeat(${currentHeight}, 64px)`,
          }}
        >
          {board.map((row, rIdx) => row.map((_, cIdx) => renderCell(rIdx, cIdx)))}
        </div>
      )}

      {/* Menu de configuração */}
      <div className={styles.menu}>
        <label>
          X (Width):
          <input
            type="number"
            value={boardWidth}
            min={6}
            max={12}
            onChange={(e) => setBoardWidth(Number(e.target.value))}
          />
        </label>
        <label>
          Y (Height):
          <input
            type="number"
            value={boardHeight}
            min={6}
            max={12}
            onChange={(e) => setBoardHeight(Number(e.target.value))}
          />
        </label>
        <button className={styles.playButton} onClick={handleStart}>Play</button>
      </div>

      {/* Tela de vitória */}
      {winner && (
        <div className={styles.winnerOverlay}>
          <h2>{winner.toUpperCase()} Wins!</h2>
          <div className={styles.buttonGroup}>
            <button className={styles.overlayButton} onClick={handleStart}>
              Start New Match
            </button>
            <button
              className={styles.overlayButton}
              onClick={() => {
                setBoardWidth(6);
                setBoardHeight(6);
                setCurrentWidth(6);
                setCurrentHeight(6);
                setBoard(createInitialBoard(6, 6));
                setTurn('white');
                setSelected(null);
                setValidMoves([]);
                setWinner(null);
              }}
            >
              Go Back to Home
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

