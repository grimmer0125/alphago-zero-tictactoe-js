export default class MCTS {
  constructor(game, nnet, args) {
    console.log('MCTS constructer');
    this.game = game;
    this.nnet = nnet;
    this.args = args;

    // TODO: add others later
  }

  // return a array-like object
  getActionProb(canonicalBoard, temp = 1) {
    return [];
  }

  search(canonicalBoard) {

  }
}
