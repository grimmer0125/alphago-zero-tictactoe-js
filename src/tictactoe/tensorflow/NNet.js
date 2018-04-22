import { NeuralNet } from '../../NeuralNet';
import deepcopy from 'deepcopy';
import nj from 'numjs';
import * as tf from '@tensorflow/tfjs';

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
    this.nnet = new TicTacToeNNet(game, args);
    const { a, b } = game.getBoardSize();
    this.board_x = a;
    this.board_y = b;
    // return { a: this.n, b: this.n };
    this.action_size = game.getActionSize();

    console.log('NNetWrapper constructer');
  }

  async train(examples) {
    console.log('train -1. epoch size:', args.batch_size);
    console.log('examples:', examples);
    const total = examples.length;

    const inputData = [];
    const pisData = [];
    const vsData = [];

    for (let i = 0; i < total; i++) {
      const example = examples[i];
      const { input_boards, target_pis, target_vs } = example;
      const input_boards2 = input_boards.tolist(); // 3x3 numjs(numpy ndarray like)
      inputData.push(input_boards2);
      pisData.push(target_pis);
      vsData.push(target_vs);
      // console.log('pisData item size:', target_pis.length);
    }

    let xTrain = tf.tensor3d(inputData, [total, 3, 3]); // null;// tf.tensor2d(batchX, [batchX.length, 18]); // 1 set, 18 inputs (neurons)
    xTrain = xTrain.reshape([total, 3, 3, 1]);

    const yTrain1 = tf.tensor2d(pisData);// , [total, 10]);
    const yTrain2 = tf.tensor2d(vsData, [total, 1]); // 784
    console.log('start train2');
    // tensorflow.js的mnist是
    // data -> tensorflow format, batch * 784, 用tesnorflow2d
    // batch.xs.reshape([BATCH_SIZE, 28, 28, 1])
    // 而且是故意每次都用batchSize丟進去 fit

    // [(ndrray->抽出來變成一個tensorflow array, 且要是1x3x3,
    //  target pis array->抽出來?, targetValue抽出來)]
    //
    // 之前是把input轉成一個 list (8xx個) of numpy array(3x3),
    // 再轉成numpy Array(8xx x 33 x 33), 現在要是 8xx x 33 x 33 x 1
    // output兩個也是轉成numpy array

    // """
    // examples: list of examples, each example is of form (board, pi, v)
    // """
    // input_boards(3,3 array), target_pis(0~9, pure array[0.1, ....]), target_vs (-1<= <=1) = list(zip(*examples))
    // input_boards = np.asarray(input_boards) ->轉ndarray
    // target_pis = np.asarray(target_pis)
    // target_vs = np.asarray(target_vs)
    // self.nnet.model.fit(x = input_boards, y = [target_pis, target_vs],
    // batch_size = args.batch_size, epochs = args.epochs)

    // const xTrain = tf.tensor2d(batchX, [batchX.length, 18]); // 1 set, 18 inputs (neurons)

    // 之前的都像是這種case,  只是現在應該是 [n(>batch_size), 10];
    // const yTrain1 = tf.tensor2d(batchY, [batchY.length, 10]); // 784x10
    // const yTrain2 = tf.tensor2d(batchY, [batchY.length, 1]); // 784
    // batch.xs.reshape([BATCH_SIZE, 28, 28, 1]
    try {
      const history = await this.nnet.model.fit(xTrain, [yTrain1, yTrain2], {
        shuffle: true,
        batchSize: args.batch_size,
        epochs: args.epochs, // params.epochs, //iris, default 40, use epoch as batch
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log('onEpochEnd');
          },
        },
      });
    } catch (err) {
      console.log('train error:', err);
    }


    console.log('training-2: after fit');
  }

  async loadPretrained(url) {
    console.log('load model start');

    // 'https://foo.bar/tfjs_artifacts/model.json'
    this.preTrainedModel = await tf.loadModel(url);
    console.log('load model ok');
  }

  predict(boardNdArray) {
    // # preparing input
    // console.log('prediction');

    // board = board[np.newaxis, :, :]

    try {
      // TODO remove hard code [1,3,3]
      let input = boardNdArray.tolist();//= nj.reshape(boardNdArray, [1, 3, 3]);

      // needs 3d array

      // [1 set, x,y, dummy]
      // const x = tf.tensor4d([input], [1, 3, 3, 1]);
      // shape()
      input = tf.tensor3d([input], [1, 3, 3]);

      // # run
      let prediction;
      if (this.preTrainedModel) {
        // NOTE: This is to test loading preTrainedModel
        // console.log('use pretrained model to predict');
        prediction = this.preTrainedModel.predict(input);
      } else {
        input = input.reshape([1, 3, 3, 1]);
        prediction = this.nnet.model.predict(input);
      }

      // pi, v = this.nnet.model.predict(board)
      // const c3 = nj.reshape(c, [1, 3, 3]);// ) c.get(0, 2);// + 8;

      const data1 = prediction[0].dataSync(); // 這裡變成一維的, 可能是因為[output]會自動變成output吧

      // console.log('getPrediction end:', data);
      const data12 = Array.from(data1);
      // console.log('getPrediction end2:', data2);

      const data2 = Array.from(prediction[1].dataSync());

      const Ps = data12;// [0,1,2,3];
      const v = data2[0]; // e.g.[0.1];

      // #print('PREDICTION TIME TAKEN : {0:03f}'.format(time.time()-start))
      // return pi[0], v[0], 還是ndarray格式

      // console.log('tensorflow Ps:', Ps, 'v:', v);
      prediction[0].dispose();
      prediction[1].dispose();
      input.dispose();
      return { Ps, v };
    } catch (err) {
      console.log('prediction error:', err);
    }
  }

  // NOTE: low priority
  save_checkpoint(folder = 'checkpoint', filename = 'checkpoint.pth.tar') {
    // use deepcopy instead of using a file

  }

  // NOTE: low priority
  load_checkpoint(folder = 'checkpoint', filename = 'checkpoint.pth.tar') {
  }
}
