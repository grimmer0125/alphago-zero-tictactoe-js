export class RandomPlayer {
  constructor(game) {
    console.log('RandomPlayer constructer');
    this.game = game;
  }

  play= (board) => {
    let a = Math.floor(Math.random() * this.game.getActionSize());
    // a = np.random.randint(self.game.getActionSize()) [0, low)
    let valids = this.game.getValidMoves(board, 1);
    valids = valids.tolist();

    while (valids[a] !== 1) {
      a = Math.floor(Math.random() * this.game.getActionSize());
    }
    return a;
  }
}

// TODO: low priority
export class HumanTicTacToePlayer {
  constructor(game) {
    console.log('HumanTicTacToePlayer constructer');
    this.game = game;
    this.isHuman = true;
  }

  play = (board) => {

  }
}
