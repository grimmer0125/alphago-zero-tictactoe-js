export default class Arena {
  // """
  // An Arena class where any 2 agents can be pit against each other.
  // """
  constructor(player1, player2, game, display) {
    console.log('Arena constructer');
    this.player1 = player1;
    this.player2 = player2;
    this.game = game;
    this.display = display;
  }

  playGame(verbose = false) {
    const players = [this.player2, null, this.player1];
    let curPlayer = 1;
    let boardNdArray = this.game.getInitBoardNdArray();
    let it = 0;
    while (this.game.getGameEnded(boardNdArray, curPlayer) === 0) {
      // curPlayer: 1 or -1
      it += 1;
      if (verbose) {
        this.display(boardNdArray);
        console.log(`Turn ${it}. Player ${curPlayer}`);
      }
      const action = players[curPlayer + 1].play(this.game.getCanonicalForm(boardNdArray, curPlayer));
      let valids = this.game.getValidMoves(this.game.getCanonicalForm(boardNdArray, curPlayer), 1);
      valids = valids.tolist();

      if (valids[action] == 0) {
        console.log(action);
        // assert valids[action] >0
        throw 'can not find out valid action, something wrong';
      }
      const nextState = this.game.getNextState(boardNdArray, curPlayer, action);
      boardNdArray = nextState.boardNdArray;
      curPlayer = nextState.curPlayer;
    }

    if (verbose) {
      console.log(`Game over: Turn ${it}. Result ${this.game.getGameEnded(boardNdArray, 1)}`);
      // assert(self.display)
      this.display(boardNdArray);
    }

    return this.game.getGameEnded(boardNdArray, 1);
  }


  playGames(num, verbose = false) {
    // eps_time = AverageMeter()
    // bar = Bar('Arena.playGames', max=num)
    // end = time.time()
    const esp = 0;
    const maxeps = Math.floor(num); // int(num)

    num = Math.floor(num / 2);
    let oneWon = 0;
    let twoWon = 0;
    let draws = 0;
    for (let i = 0; i < num; i++) {
      const gameResult = this.playGame(verbose);
      if (gameResult == 1) {
        oneWon += 1;
      } else if (gameResult == -1) {
        twoWon += 1;
      } else {
        draws += 1;
      }

      // # bookkeeping + plot progress
      // eps += 1
      // eps_time.update(time.time() - end)
      // end = time.time()
      // bar.suffix  = '({eps}/{maxeps}) Eps Time: {et:.3f}s | Total: {total:} | ETA: {eta:}'.format(eps=eps+1, maxeps=maxeps, et=eps_time.avg,
      //                                                                                            total=bar.elapsed_td, eta=bar.eta_td)
      // bar.next()
    }

    console.log('swap');

    const tmpPlayer1 = this.player1;
    this.player1 = this.player2,
    this.player2 = tmpPlayer1;

    for (let i = 0; i < num; i++) {
      const gameResult = this.playGame(verbose);
      if (gameResult == -1) {
        oneWon += 1;
      } else if (gameResult == 1) {
        twoWon += 1;
      } else {
        draws += 1;
      }

      // # bookkeeping + plot progress
      // eps += 1
      // eps_time.update(time.time() - end)
      // end = time.time()
      // bar.suffix  = '({eps}/{maxeps}) Eps Time: {et:.3f}s | Total: {total:} | ETA: {eta:}'.format(eps=eps+1, maxeps=num, et=eps_time.avg,
      //                                                                                            total=bar.elapsed_td, eta=bar.eta_td)
      // bar.next()
    }
    // bar.finish()

    return { oneWon, twoWon, draws };
  }
}
