import Arena from './Arena';
import MCTS from 'MCTS';

import { TicTacToeGame, display } from './tictactoe/TicTacToeGame';

import { NNetWrapper as NNet } from './tictactoe/tensorflow/NNet';
// from tictactoe.keras.NNet import NNetWrapper

import * as players from './tictactoe/TicTacToePlayers';
// from tictactoe.TicTacToePlayers import *

export default function play() {
  const g = TicTacToeGame();
  const rp = players.RandomPlayer(g).play;
  const rp2 = players.RandomPlayer(g).play;

  // hp = HumanTicTacToePlayer(g).play

  // nnet players
  const n1 = NNet(g);
  n1.load_checkpoint('./pretrained_models/tictactoe/keras/', 'best.pth-grimmer2-less.tar');

  const args1 = { numMCTSSims: 50, cpuct: 1.0 }; // dotdict({ numMCTSSims:
  const mcts1 = MCTS(g, n1, args1);

  // python ver.: n1p = lambda x: np.argmax(mcts1.getActionProb(x, temp=0))
  const n1p = (x) => {
    const list = mcts1.getActionProb(x, 0);
    const len = list.length;
    let maxIndex = -1;
    let maxValue = null;
    for (let i = 0; i < len; i++) {
      const value = list[i];
      if (i === 0) {
        maxValue = value;
      } else if (value > maxValue) {
        maxValue = value;
        maxIndex = i;
      }
    }
    if (maxIndex === -1) {
      throw 'bad prop-list to search max';
    }
    return maxIndex;
  };

  // const arena = Arena.Arena(n1p, rp, g, display);
  const arena = Arena.Arena(rp, rp2, g, display);
  console.log(arena.playGames(1, true));
  console.log('finish');
}
