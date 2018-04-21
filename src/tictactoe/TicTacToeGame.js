import { Game } from '../Game';
import Board from './TicTacToeLogic';
import nj from 'numjs';

// Grimmer: This class needs a lot of numpy operations
export class TicTacToeGame extends Game {
  constructor(n = 3) {
    super();
    console.log('TicTacToeGame constructer');
    // board size, 3x3 for TicTacToeGame
    this.n = n;
  }

  getInitBoardNdArray() {
    const b = new Board(this.n);
    return nj.array(b.pieces);
    // return np.array(b.pieces)
  }

  // used by *NNet classes
  getBoardSize() {
    return { a: this.n, b: this.n };
  }

  // return number of actions
  // QUESTION: why +1, grimmer?
  getActionSize() {
    return (this.n * this.n) + 1;
  }

  getNextState(boardNdArray, player, action) {
    // # if player takes action on board, return next (board,player)
    // # action must be a valid move
    // QUESTION: why this condition, grimmer?
    if (action === this.n * this.n) {
      // return (board, -player)
      console.log('invalid action');
      return { boardNdArray, player: -player };
    }

    // b = Board(self.n)
    // b.pieces = np.copy(board)
    const b = new Board(this.n);
    b.pieces = boardNdArray.tolist();

    const move = { x: Math.floor(action / this.n), y: (action % this.n) };
    b.execute_move(move, player);
    return { boardNdArray: nj.array(b.pieces), curPlayer: -player };
  }

  // return a list, 會受getCanonicalForm影響嗎? 不會.
  getValidMoves(boardNdArray, player) {
  // # return a fixed size binary vector
  // valids = [0]*this.getActionSize()
    const valids = Array(this.getActionSize()).fill(0);
    const b = new Board(this.n);
    // b.pieces = np.copy(board)
    b.pieces = boardNdArray.tolist();

    const legalMoves = b.get_legal_moves(player);
    if (legalMoves.length === 0) {
      valids[valids.length - 1] = 1;
      // valids[-1]=1 // the last item
      return nj.array(valids);
    }

    legalMoves.forEach((element) => {
      const { x, y } = element;
      valids[(this.n * x) + y] = 1; // flattern to vector
    });

    // Note: using ndarray type is for MTCS' search: self.Ps[s]*valids
    return nj.array(valids);
  }

  getGameEnded(boardNdArray, player) {
    // # return 0 if not ended, 1 if player 1 won, -1 if player 1 lost
    // # player = 1
    const b = new Board(this.n);
    b.pieces = boardNdArray.tolist();

    if (b.is_win(player)) {
      return 1;
    }
    if (b.is_win(-player)) {
      return -1;
    }
    if (b.has_legal_moves()) {
      return 0;
    }
    // # draw has a very little value
    return 1e-4;
  }

  // at least not useful for playing. Useful for training (executeEpisode)?
  getCanonicalForm(boardNdArray, player) {
    // # return state if player==1, else return -state if player==-1
    // return player*board
    return nj.multiply(boardNdArray, player);
  }

  getSymmetries(board, pi) {

  }

  // used by MCTS
  stringRepresentation(boardNdArray) {
    // # 3x3 numpy array (canonical board)
    return JSON.stringify(boardNdArray);
  }
}

let log = '';
function print(newLog, end) {
  log += newLog;
  if (typeof end !== 'undefined' && end !== null) {
    log += end;
  } else {
    log += '\n';
  }
}
function flush() {
  console.log(log);
}

export function display(boardNdArray) {
  log = '';
  const n = boardNdArray.shape[0];
  const list = boardNdArray.tolist();
  print('  ', '');
  for (let y = 0; y < n; y++) {
    print(`${y}`, ' ');
  }
  // for y in range(n):
  //     print (y,"", end="")

  print('');
  print(' ', '');
  // for _ in range(n):
  //     print ("-", end="-")
  for (let _ = 0; _ < n; _++) {
    print('-', '-');
  }

  print('--');
  for (let y = 0; y < n; y++) {
    print(`${y}|`, ''); // # print the row #
    for (let x = 0; x < n; x++) {
      const piece = list[y][x]; // # get the piece to print
      if (piece == -1) {
        print('X ', '');
      } else if (piece == 1) {
        print('O ', '');
      } else if (x == n) {
        print('-', '');
      } else {
        print('- ', '');
      }
    }
    print('|');
  }

  print(' ', '');
  for (let _ = 0; _ < n; _++) {
    print('-', '-');
  }
  // for _ in range(n):
  //     print ("-", end="-")
  print('--');
  flush();
  console.log('flush');
}
