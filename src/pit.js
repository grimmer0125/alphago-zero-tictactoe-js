import Arena from './Arena';
import MCTS from './MCTS';
import Utils from './Utils';

import { TicTacToeGame, display } from './tictactoe/TicTacToeGame';

import { NNetWrapper as NNet } from './tictactoe/tensorflow/NNet';
// from tictactoe.keras.NNet import NNetWrapper

import * as players from './tictactoe/TicTacToePlayers';
// from tictactoe.TicTacToePlayers import *

export default function play() {
  const g = new TicTacToeGame();
  const rp = new players.RandomPlayer(g);// .play;
  const rp2 = new players.RandomPlayer(g);// .play;

  // hp = HumanTicTacToePlayer(g).play

  // nnet players
  const n1 = new NNet(g);
  n1.load_checkpoint('./pretrained_models/tictactoe/keras/', 'best.pth-grimmer2-less.tar');

  const args1 = { numMCTSSims: 50, cpuct: 1.0 }; // dotdict({ numMCTSSims:
  const mcts1 = new MCTS(g, n1, args1);

  // python ver.: n1p = lambda x: np.argmax(mcts1.getActionProb(x, temp=0))
  const n1p = (x) => {
    const list = mcts1.getActionProb(x, 0);
    return Utils.argmax(list);
  };

  // const arena = Arena.Arena({play:n1p}, rp, g, display);
  const arena = new Arena(rp, rp2, g, display);
  console.log(arena.playGames(10, false));
  console.log('finish');
}
