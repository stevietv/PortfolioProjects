import { useState } from 'react';

function Square({ value, isWinner, onSquareClick }) {
  return (
    <button className={isWinner ? 'square winner' : 'square'} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
        return ([a,b,c]);
      }
    }
    return null;
  }

  function createSquare(i, isWinner) {
    return <Square value={squares[i]} isWinner={isWinner} onSquareClick={() => handleClick(i)} />;
  }

  function renderBoard(winnerList) {
    let board = [];
    let squareCounter = 0;
    for (let i = 0; i < 3; i++) {
      let rowSquares = [];
      for (let j = 0; j < 3; j++) {
        let isWinner = winnerList.includes(squareCounter);
        rowSquares.push(createSquare(squareCounter++, isWinner));
      }
      board.push(<div className='board-row'>{rowSquares}</div>);
    }
    return board;
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + squares[winner[1]];
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className='status'>{status}</div>

      {renderBoard(winner || [])}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move == currentMove) {
      description = 'You are at move #' + move;
    } else if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    if (move == currentMove) {
      return <li key={move}>{description}</li>;
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
