import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Checkbox } from 'semantic-ui-react';

import play from './pit';
import train from './main';
// import train from './tictactoe/tensorflow/TicTacToeNNet';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inUIPage: false,
    };
  }

  twoRandowmPlay =() => {
    play();
  }

  startTrain = () => {
    train();
  }

  // selfTrainVSRandom = () => {
  //   console.log('selfTrainVSRandom');
  //   play(1);
  // }

  // userVSuser = () => {
  // }

  twoRandowmPlayWithPretrained = async () => {
    await play(2);
  }

  render() {
    return (
      <div className="App" style={{ display: 'flex', justifyContent: 'center' }}>
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header> */}

        <div>
          <p className="App-intro">
            <code>No UI</code> refers to use Console to debug or see the results.
          </p>
          <div>
            <button onClick={this.twoRandowmPlay}>
              No UI. Two random Play
            </button>
          </div>
          <div>
            <button onClick={this.startTrain}>
              No UI. Start self-Train.
            </button>
          </div>
          {/* <div>
            <button onClick={this.selfTrainVSRandom}>
              No UI. Self-trained vs Random
            </button>
          </div> */}
          {/* <div>
            <button onClick={this.userVSSelfTrain}>
              user VS SelfTrained
            </button>
          </div> */}

          <div>
            <button onClick={this.twoRandowmPlayWithPretrained}>
              No UI. Test Pretrained vs Random
            </button>
          </div>
          <hr />
          {/* <div>
            <button onClick={this.userVSPretrained}>
              User VS Pretrained AlphaGo AI, show TicTacToe UI to play
            </button>
          </div> */}
          User1 vs User2
          <Checkbox label="Apply Pretrained AlphaGo AI for User2" />

          <div>
            <TicTacToeApp />
          </div>

          {/* <div>
            <button onClick={this.userVSuser}>
              userVSuser
            </button>
          </div> */}
        </div>

      </div>
    );
  }
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class TicTacToeBoard extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class TicTacToeApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move}` :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <TicTacToeBoard
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

// ReactDOM.render(<Game />, document.getElementById('root'));

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
      return squares[a];
    }
  }
  return null;
}

export default App;
