import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// import train from './tictactoe/tensorflow/TicTacToeNNet';

import play from './pit';
import train from './main';

class App extends Component {
  constructor(props) {
    super(props);
  }


  twoRandowmPlay =() => {
    play();
  }

  startTrain = () => {
    train();
  }

  selfTrainVSRandom = () => {
    console.log('selfTrainVSRandom');
    play(1);
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
        <button onClick={this.twoRandowmPlay}>
          Two random Play
        </button>
        <button onClick={this.startTrain}>
          Start self-Train
        </button>
        <button onClick={this.selfTrainVSRandom}>
          Self-trained vs Random
        </button>
        <button onClick={this.userVSPretrained}>
          User VS Pretrained
        </button>
        <button onClick={this.userVSSelfTrain}>
          user VS SelfTrained
        </button>
      </div>
    );
  }
}

export default App;
