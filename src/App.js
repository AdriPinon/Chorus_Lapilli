import React, { Fragment, useState } from 'react';

function Square ({value, onSquareClick}) {
    return (
    <button className="square"  onClick={onSquareClick}>
      {value}
      </button>);
}


export default function Board() {
  const [xIsNext, setXIsNext] = useState(true); // handles user state
  const [squares, setSquares] = useState(Array(9).fill(null)); // handles square state

 
  const [second, setSecond] = useState(false);

  // handles lapilli mode
  let lapilli = false; 

  if (
    squares.filter(squares => squares).length === 6
  ) {
    lapilli = true;
  }

  if (lapilli){

    if (!second && mustMoveCenter(xIsNext, squares)){
      const nextSquares = squares.slice();

      nextSquares[4] = '✔'; // if in the center
      setSecond(true);

      setSquares(nextSquares);
    }
  }

  // handles all click occurences 
  function handleClick(i) {
    if (calculateWinner(squares)) return; 

    const nextSquares = squares.slice();

    if (! lapilli ){
    if (squares[i]) return; 

    if (xIsNext) 
      nextSquares[i] = 'X';
    else 
      nextSquares[i] = 'O';

    setXIsNext(!xIsNext); 

    } else {  
      
      if (!second && 
        ((squares[i] === 'X' && xIsNext) || (squares[i] === 'O' && !xIsNext))
        && moveAllowed(i, squares)
        ) { 

        nextSquares[i] = '✔';
        setSecond(true);

      } else if (second) {
        const checkIndex = nextSquares.findIndex(i => i === '✔')

        if (isAdjacentAndNotOccupied(checkIndex,i, squares)){
          

        if (xIsNext) 
          nextSquares[i] = 'X';
        else 
          nextSquares[i] = 'O';

        
        nextSquares[checkIndex] = null;

        setSecond(false);
        setXIsNext(!xIsNext);
        }
      }

    }

    setSquares(nextSquares);
  }

  const winner = calculateWinner(squares); 
  let status;
  if (winner){
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? 'X' : 'O');
  }

  return (
  <Fragment>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
  </Fragment>
  );
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
    [2, 4, 6]
  ];  

  for (let i = 0 ; i < lines.length ; i++){
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      console.log(squares[a], squares[b], squares[c]);
      return squares[a];
    }
  }

  return null;

  }

  function isAdjacentAndNotOccupied(oldPosition, newPosition, squares){
    const adjacencies = [ 
      [1, 3, 4],
      [0, 2, 3, 4, 5],
      [1, 4, 5],
      [0, 1, 4, 6, 7],
      [0, 1, 2, 3, 5, 6, 7, 8],
      [1, 2, 4, 7, 8],
      [3, 4, 7],
      [3, 4, 5, 6, 8],
      [4, 5, 7]
    ];

    if (adjacencies[oldPosition].includes(newPosition) && squares[newPosition] === null) return true;
    else return false;
  }

  function moveAllowed(position, squares) {
    
    const adjacencies = [ 
    [1, 3, 4],
    [0, 2, 3, 4, 5],
    [1, 4, 5],
    [0, 1, 4, 6, 7],
    [0, 1, 2, 3, 5, 6, 7, 8],
    [1, 2, 4, 7, 8],
    [3, 4, 7],
    [3, 4, 5, 6, 8],
    [4, 5, 7]
  ];

  for (const possibility of adjacencies[position]){
    if (! squares[possibility]) return true;   
  }

  return false;
  }

  function mustMoveCenter(X, squares){
    let comparison;
    if (X) {
      comparison = 'X';
    } else {
      comparison = 'O';
    }

    if (squares[4] !== comparison) return false; 



    const winPair = [ 
      [5, 7], 
      [3, 5, 6, 8], 
      [3, 7],
      [7, 8] 
    ]

    

    if (squares.slice(0, 4).includes(comparison)){
     
      const index = squares.indexOf(comparison);

      console.log('my index: ', index);

      for (const possibility of winPair[index]){
        if (squares[possibility] === comparison) return false; 
      }
    }

    return true;

  }
