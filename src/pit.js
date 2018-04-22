import Arena from './Arena';
import MCTS from './MCTS';
import Utils from './Utils';
import { getGlobalNN } from './main';

import { TicTacToeGame, display } from './tictactoe/TicTacToeGame';

import { NNetWrapper as NNet } from './tictactoe/tensorflow/NNet';
// from tictactoe.keras.NNet import NNetWrapper

import * as players from './tictactoe/TicTacToePlayers';
// from tictactoe.TicTacToePlayers import *

// mode
// 0: two rp
// 1: self-trained vs rp
export default function play(mode) {
  const g = new TicTacToeGame();
  let firstPlayr = null;
  if (!mode) {
    firstPlayr = new players.RandomPlayer(g);
  } else if (mode === 1) {
    // nnet players

    // TODO: this is a workaround way, improve later
    // const n1 = new NNet(g);
    // n1.load_checkpoint('./pretrained_models/tictactoe/keras/', 'best.pth-grimmer2-less.tar');

    const n1 = getGlobalNN;
    const args1 = { numMCTSSims: 50, cpuct: 1.0 }; // dotdict({ numMCTSSims:
    const mcts1 = new MCTS(g, n1, args1);

    // python ver.: n1p = lambda x: np.argmax(mcts1.getActionProb(x, temp=0))
    const n1p = (x) => {
      const list = mcts1.getActionProb(x, 0);
      return Utils.argmax(list);
    };
    firstPlayr = { play: n1p };
    // const arena = Arena.Arena({play:n1p}, rp2, g, display);
  } else {
    console.log('invalid mode, return');
    // hp = HumanTicTacToePlayer(g).play
    return;
  }
  // const rp = new players.RandomPlayer(g);// .play;
  const rp2 = new players.RandomPlayer(g);// .play;

  const arena = new Arena(firstPlayr, rp2, g, display);
  console.log(arena.playGames(10, true));
  console.log('finish');
}
