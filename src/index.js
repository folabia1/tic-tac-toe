import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}
  
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    );
  }

   

  render() {
    // let boardRows = [];
    // boardRows.push(<div></div>);
    let outer = [];
    for (let i=0; i<3; i++) {
      let inner = [];
      for (let j=0; j<3; j++) {
        inner.push(this.renderSquare((i*3)+j));
      }
      outer.push(<div className="board-row" key={i}>{inner}</div>);
    }

    return (
      <div>
        {outer}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastMove: null,
      }],
      moveNumber: 0,
      xIsNext: true,
      displayMovesAsc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.moveNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : '0';
    this.setState({
      history: history.concat([{
        squares: squares,
        lastMove: `(${Math.floor(i/3)}, ${(i%3)})`,
      }]),
      moveNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
    unselectAll();
  }

  jumpTo(step) {
    this.setState({
      moveNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  reverseOrder() {
    this.setState({
      displayMovesAsc: !this.state.displayMovesAsc,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.moveNumber];
    const winner = calculateWinner(current.squares);
    const lastMove = this.state.history[history.length - 1].lastMove;
    const displayMovesAsc = this.state.displayMovesAsc;

    let moves = [];
    for (let i=0; i<history.length; i++) {
        let move = displayMovesAsc ? i : (history.length-1) - i;
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        moves.push(
          <li key={move}>
            <button onClick={() => {
              this.jumpTo(move);
              makeSelectedMoveBold(move);
            }
            }>
              {desc}
            </button>
          </li>
        );
      }

    let status;
    if (winner) {
      status = 'Winner: ' + winner[0];
      const allSquares = document.querySelectorAll(".square");
      for (let i=0; i<allSquares.length; i++) {
        let square = allSquares[i];
        if (winner[1].includes(i)) {
          square.style.background = 'green';
        }
      }
    } else if (history.length > 9) {
      status = "It's a Draw";
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : '0');
      const allSquares = document.querySelectorAll(".square");
      for (let i=0; i<allSquares.length; i++) {
        let square = allSquares[i];
        square.style.background = 'white';
      }
    }

    let lastMoveMessage;
    if (lastMove) {
      lastMoveMessage = "\t\tLast move: " + lastMove;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{lastMoveMessage}</div>
          <ol>{moves}</ol>
          
          <button
            onClick={() => this.reverseOrder()}
          >
            Reverse Order
          </button>
        </div>
      </div>
    );
  }

}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);



function makeSelectedMoveBold(move) {
  const parentElement = document.querySelector("ol");
  let allChildren = parentElement.querySelectorAll("li");
  let allChildrenArray = Array.from(allChildren);
  // console.log(allChildrenArray.slice(0,move));
  for (let i=0; i<allChildrenArray.length; i++) {
    // console.log(allChildren[i]);
    if (i === move) {
      allChildren[i].style.fontWeight = "bold";
    } else {
      allChildren[i].style.fontWeight = "normal";
    }
  }
}

function unselectAll() {
  const parentElement = document.querySelector("ol");
  let allChildren = parentElement.querySelectorAll("li");
  for (let i=0; i<allChildren.length; i++) {
    allChildren[i].style.fontWeight = "normal";
  }
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}
  
  