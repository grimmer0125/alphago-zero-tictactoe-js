import Utils from './Utils';
import nj from 'numjs';

const EPS = 1e-8;

export default class MCTS {
  constructor(game, nnet, args) {
    console.log('MCTS constructer');
    this.game = game;
    this.nnet = nnet;
    this.args = args;
    this.Qsa = {}; // stores Q values for s,a (as defined in the paper)
    this.Nsa = {}; // stores #times edge s,a was visited
    this.Ns = {}; // stores #times board s was visited
    this.Ps = {}; // stores initial policy (returned by neural net)

    this.Es = {}; // stores game.getGameEnded ended for board s
    this.Vs = {}; // stores game.getValidMoves for board s
  }

  // return a array-like object
  getActionProb(canonicalBoard, temp = 1) {
    console.log('getActionProb 1');
    for (let i = 0; i < this.args.numMCTSSims; i++) {
      // console.log(`MCTS loop:${i}`);
      this.search(canonicalBoard);
    }
    console.log('getActionProb MCTS loop ends');
    const s = this.game.stringRepresentation(canonicalBoard);

    const aSize = this.game.getActionSize();
    let counts = [];
    for (let a = 0; a < aSize; a++) {
      const saKey = `${s};${a}`;
      if (this.Nsa.hasOwnProperty(saKey)) {
        counts.push(this.Nsa[saKey]);
      } else {
        counts.push(0);
      }
    }

    let probs;
    if (temp === 0) {
      const bestA = Utils.argmax(counts);
      probs = Array(counts.length).fill(0);
      probs[bestA] = 1;
      return probs;
    }

    counts = counts.map(x => x ** (1.0 / temp));
    const sum = counts.reduce((x, y) => x + y);
    probs = counts.map(x => x / sum);
    console.log('getActionProb 2');
    return probs;
  }

  // """
  // This function performs one iteration of MCTS. It is recursively called
  // till a leaf node is found. The action chosen at each node is one that
  // has the maximum upper confidence bound as in the paper.
  //
  // Once a leaf node is found, the neural network is called to return an
  // initial policy P and a value v for the state. This value is propogated
  // up the search path. In case the leaf node is a terminal state, the
  // outcome is propogated up the search path. The values of Ns, Nsa, Qsa are
  // updated.
  //
  // NOTE: the return values are the negative of the value of the current
  // state. This is done since v is in [-1,1] and if v is the value of a
  // state for the current player, then its value is -v for the other player.
  //
  // Returns:
  //     v: the negative of the value of the current canonicalBoard
  // """
  search(canonicalBoard) {
    const s = this.game.stringRepresentation(canonicalBoard);

    if (this.Es.hasOwnProperty(s) == false) {
      this.Es[s] = this.game.getGameEnded(canonicalBoard, 1);
    }

    if (this.Es[s] != 0) {
      // # terminal node
      return -this.Es[s];
    }

    if (this.Ps.hasOwnProperty(s) == false) {
      // # leaf node
      // QUESTION: v為[0.x] , array1x1的ndarray !! u應該也是, qsa
      const resp = this.nnet.predict(canonicalBoard);
      this.Ps[s] = resp.Ps;
      const v = resp.v;// .get(0);

      const valids = this.game.getValidMoves(canonicalBoard, 1);
      // NB: Array multiplication is not matrix multiplication:
      this.Ps[s] = nj.multiply(this.Ps[s], valids); // # masking invalid moves
      const sum_Ps_s = nj.sum(this.Ps[s]);
      if (sum_Ps_s > 0) {
        this.Ps[s] = nj.divide(this.Ps[s], sum_Ps_s); // renormalize
      } else {
        // # if all valid moves were masked make all valid moves equally probable
        //
        // # NB! All valid moves may be masked if either your NNet architecture is insufficient or you've get overfitting or something else.
        // # If you have got dozens or hundreds of these messages you should pay attention to your NNet and/or training process.
        console.log('All valid moves were masked, do workaround.');
        this.Ps[s] = nj.add(this.Ps[s], valids);
        this.Ps[s] = nj.divide(this.Ps[s], nj.sum(this.Ps[s]));
      }

      this.Vs[s] = valids;
      this.Ns[s] = 0;

      // self.Ps[s] = self.Ps[s]*valids
    }

    const valids = this.Vs[s];
    let cur_best = Number.NEGATIVE_INFINITY;
    let best_act = -1;
    const aSize = this.game.getActionSize();
    // # pick the action with the highest upper confidence bound
    for (let a = 0; a < aSize; a++) {
      // NB valid is a ndarray
      if (valids.get(a) > 0) {
        const saKey = `${s};${a}`;
        let u;
        if (this.Qsa.hasOwnProperty(saKey)) {
          // TODO: check. type: [value], ndrray. case0.
          // this.Ps的access可以直接[][]嗎? 還有Qsa[]出來的應該是 [0.x],
          // 可能也要改, 這個直接改一開始的predict result v就好了
          u = this.Qsa[saKey] + this.args.cpuct * this.Ps[s].get(a) * Math.sqrt(this.Ns[s]) / (1 + this.Nsa[saKey]);
        } else {
          // TODO: check. type:value
          u = this.args.cpuct * this.Ps[s].get(a) * Math.sqrt(this.Ns[s] + EPS); //    # Q = 0 ?
        }

        // QUESTION: : 可能會有value 跟 ndarray [x] 的比較需求出現, case1
        // 以及 -v, -1*numjs的case2, 還有  // case4
        if (u > cur_best) {
          cur_best = u;
          best_act = a;
        }
      }
    }

    const a = best_act; // a: value

    const nextState = this.game.getNextState(canonicalBoard, 1, a);
    let next_s = nextState.boardNdArray;
    const next_player = nextState.curPlayer;

    next_s = this.game.getCanonicalForm(next_s, next_player);
    const v = this.search(next_s);
    const saKey = `${s};${a}`;
    if (this.Qsa.hasOwnProperty(saKey)) {
      // TODO: check, case4
      this.Qsa[saKey] = (this.Nsa[saKey] * this.Qsa[saKey] + v) / (this.Nsa[saKey] + 1);

      this.Nsa[saKey] += 1;
    } else {
      this.Qsa[saKey] = v;
      this.Nsa[saKey] = 1;
    }

    this.Ns[s] += 1;
    return -v;
  }
}