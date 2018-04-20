import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// import train from './tictactoe/tensorflow/TicTacToeNNet';

import play from './pit';

class App extends Component {
  constructor(props) {
    super(props);
  }

  startTest = () => {
    // train();
    play();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this.startTest}>
          Start Test
        </button>
      </div>
    );
  }
}

export default App;
