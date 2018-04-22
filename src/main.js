import Coach from './Coach';
import { TicTacToeGame } from './tictactoe/TicTacToeGame';
import { NNetWrapper as NNet } from './tictactoe/tensorflow/NNet';

const args = {
  numIters: 3,
  numEps: 25,
  tempThreshold: 15,
  updateThreshold: 0.6,
  maxlenOfQueue: 200000,
  numMCTSSims: 25,
  arenaCompare: 40,
  cpuct: 1,

  checkpoint: './temp/',
  load_model: false,
  load_folder_file: { folder: '/dev/models/8x100x50', fileName: 'best.pth.tar' },
  numItersForTrainExamplesHistory: 20,

};

let globalNN = null;

export function getGlobalNN() {
  return globalNN;
}

export default function train() {
  const g = new TicTacToeGame();
  const nnet = new NNet(g);

  globalNN = nnet;

  // TODO: low priority
  // if args.load_model:
  //   nnet.load_checkpoint(args.load_folder_file[0], args.load_folder_file[1])

  const c = new Coach(g, nnet, args);
  // if args.load_model:
  // print("Load trainExamples from file")
  // c.loadTrainExamples()

  c.learn();
}
