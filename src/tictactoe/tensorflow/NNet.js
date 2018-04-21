// class NNetWrapper(NeuralNet):

import { NeuralNet } from '../../NeuralNet';
import deepcopy from 'deepcopy';

export class NNetWrapper extends NeuralNet {
  constructor() {
    super();
    console.log('NNetWrapper constructer');
  }

  predict(board) {

  }


  save_checkpoint(folder = 'checkpoint', filename = 'checkpoint.pth.tar') {
    // use deepcopy instead of using a file

  }

  // TODO: def load_checkpoint(self, folder='checkpoint', filename='checkpoint.pth.tar'):
  load_checkpoint(folder = 'checkpoint', filename = 'checkpoint.pth.tar') {
  }
}
