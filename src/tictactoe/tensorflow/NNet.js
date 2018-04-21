
import { NeuralNet } from '../../NeuralNet';
import deepcopy from 'deepcopy';

import TicTacToeNNet from './TicTacToeNNet';

const args = {
  lr: 0.001,
  dropout: 0.3,
  epochs: 10,
  batch_size: 64,
  cuda: false,
  num_channels: 512,
};

export class NNetWrapper extends NeuralNet {
  constructor(game) {
    super();
    this.nnet = TicTacToeNNet(game, args);
    const { a, b } = game.getBoardSize();
    this.board_x = a;
    this.board_y = b;
    // return { a: this.n, b: this.n };
    this.action_size = game.getActionSize();

    console.log('NNetWrapper constructer');
  }

  train(examples) {

  }

  predict(boardNdArray) {
    // # preparing input
    // board = board[np.newaxis, :, :]
    // shape()

    // # run
    // pi, v = self.nnet.model.predict(board)
    //
    // #print('PREDICTION TIME TAKEN : {0:03f}'.format(time.time()-start))
    // return pi[0], v[0], 還是ndarray格式

    return { Ps: 1, v: 1 };
  }

  // NOTE: low priority
  save_checkpoint(folder = 'checkpoint', filename = 'checkpoint.pth.tar') {
    // use deepcopy instead of using a file

  }

  // NOTE: low priority
  load_checkpoint(folder = 'checkpoint', filename = 'checkpoint.pth.tar') {
  }
}
