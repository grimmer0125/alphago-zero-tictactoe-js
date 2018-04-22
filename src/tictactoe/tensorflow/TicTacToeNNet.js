import * as tf from '@tensorflow/tfjs';

export default class TicTacToeNNet {
  constructor(game, args) {
    console.log('TicTacToeNNet constructer');
    const { a, b } = game.getBoardSize();
    this.board_x = a;
    this.board_y = b;
    this.args = args;
    // self.board_x, self.board_y = game.getBoardSize()
    this.action_size = game.getActionSize();
    // self.args = args

    const normalize1 = () => tf.layers.batchNormalization({ axis: 3 });

    const normalize2 = () => tf.layers.batchNormalization({ axis: 1 });

    const relu = () => tf.layers.activation({ activation: 'relu' });

    const conv2d_padding = () => tf.layers.conv2d({
      // inputShape: [this.board_x, this.board_y, 1],
      kernelSize: 3, // 3x3 filter
      filters: args.num_channels, // 512??
      padding: 'same',
      // strides: 1, // ?
      // activation: 'relu',
      // kernelInitializer: 'varianceScaling', // ?
    });

    const conv2d_valid = () => tf.layers.conv2d({
      kernelSize: 3,
      filters: args.num_channels,
      padding: 'valid',
    });

    const dropout = () => tf.layers.dropout({ rate: this.dropout });


    // # Neural Net
    // this.model = tf.sequential();

    // const input1 = tf.input({shape: [2, 2]});
    // const input2 = tf.input({shape: [2, 2]});
    // const addLayer = tf.layers.add();
    // const sum = addLayer.apply([input1, input2]);
    // console.log(JSON.stringify(sum.shape));


    // TODO: Reshape???
    // const input2 = tf.reshape(input, [3, 3, 1]);

    // Define input, which has a size of 5 (not including batch dimension).
    const input = tf.input({ shape: [this.board_x, this.board_y, 1] });

    // const normalize1 = tf.layers.batchNormalization({ axis: 3 });
    // Returns: tf.SymbolicTensor
    // const tmpLayer = (denseLayer1.apply(input));

    // BatchNormalization(axis=3)? https://keras-cn.readthedocs.io/en/latest/layers/normalization_layer/
    // https://js.tensorflow.org/api/0.9.0/#layers.batchNormalization
    const h_conv1 = normalize1().apply(normalize1().apply(conv2d_padding().apply(input)));


    //   h_conv4.apply(h_conv3.apply(h_conv2.apply((
    //   h_conv1.apply(input))))))));

    const h_conv2 = normalize1().apply(normalize1().apply(conv2d_padding().apply(h_conv1)));
    const h_conv3 = normalize1().apply(normalize1().apply(conv2d_padding().apply(h_conv2)));
    const h_conv4 = normalize1().apply(normalize1().apply(conv2d_valid().apply(h_conv3)));

    // const h_conv2 = normalize1.apply(tf.layers.conv2d({
    //   inputShape: [this.board_x, this.board_y, 1],
    //   kernelSize: 3, // 3x3 filter
    //   filters: args.num_channels, // 512??
    //   padding: 'same',
    //   // activation: 'relu',
    // })));
    // const h_conv3 = normalize1.apply(tf.layers.conv2d({
    //   inputShape: [this.board_x, this.board_y, 1],
    //   kernelSize: 3, // 3x3 filter
    //   filters: args.num_channels, // 512??
    //   padding: 'same',
    //   // activation: 'relu',
    // })));
    // const h_conv4 = normalize1.apply(tf.layers.conv2d({
    //   inputShape: [this.board_x, this.board_y, 1],
    //   kernelSize: 3, // 3x3 filter
    //   filters: args.num_channels, // 512??
    //   padding: 'valid',
    //   // activation: 'relu',
    // })));

    const flattenLayer = tf.layers.flatten();


    // flattenLayer.apply(input);
    // https://js.tensorflow.org/api/0.9.0/#class:layers.Layer
    // https://js.tensorflow.org/api/0.9.0/#tf.layers.Layer.apply
    // apply是layer內建之法

    // TODO: dropout????????

    // const batchNormalize = tf.layers.batchNormalization({ axis: 3 });


    const middle1 = flattenLayer.apply(h_conv4);

    // First dense layer uses relu activation.
    // const normalize2 = tf.layers.batchNormalization({ axis: 1 });
    const denseLayer1 = tf.layers.dense({ units: 1024 }).apply(middle1);
    const middle2 = dropout().apply(relu().apply(normalize2().apply(denseLayer1)));
    const denseLayer2 = tf.layers.dense({ units: 512 }).apply(middle2);
    const middle3 = dropout().apply(relu().apply(normalize2().apply(denseLayer2)));

    // const denseLayer2 = dropout.apply(normalize2.apply(tf.layers.dense({ units: 512 }))));

    // const middle = denseLayer2.apply(denseLayer1.apply(flattenLayer.apply(h_conv4)));

    // Second dense layer uses softmax activation.
    const piLayer = tf.layers.dense({ units: this.action_size, activation: 'softmax' });
    const output1 = piLayer.apply(middle3);
    const vLayer = tf.layers.dense({ units: 1, activation: 'tanh' });
    const output2 = vLayer.apply(middle3);

    // Obtain the output symbolic tensor by applying the layers on the input.
    // const output = batchNormal.apply(denseLayer2.apply(denseLayer1.apply(input)));


    // Create the model based on the inputs.
    this.model = tf.model({ inputs: input, outputs: [output1, output2] });
    const optimizer = tf.train.adam(args.lr); // irir default//params.learningRate);
    this.model.compile({
      optimizer,
      loss: ['categoricalCrossentropy', 'meanSquaredError'],

      // metrics: ['accuracy'], // <- optional
    });

  // const LEARNING_RATE = 0.15;
  // const optimizer = tf.train.sgd(LEARNING_RATE);
  // model.compile({
  //   optimizer: optimizer,
  //   loss: 'categoricalCrossentropy',
  //   metrics: ['accuracy'],
  // });

    // The model can be used for training, evaluation and prediction.
    // For example, the following line runs prediction with the model on
    // some fake data.
    // model.predict(tf.ones([2, 5])).print();
    // keras' Reshape
  }
}

export function test() {
  console.log('t1');
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

  // Generate some synthetic data for training.
  const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
  const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

  // Train the model using the data.
  model.fit(xs, ys).then(() => {
    // Use the model to do inference on a data point the model hasn't seen before:
    // Open the browser devtools to see the output
    model.predict(tf.tensor2d([5], [1, 1])).print();
    console.log('t3');
  });
  console.log('t2');
}
