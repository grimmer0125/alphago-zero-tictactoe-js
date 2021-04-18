# AlphaGo Zero Tictactoe Js

Try it: https://grimmer.io/alphago-zero-tictactoe-js/. Google DeepMind AlphaGo uses enhancement learning and the algorithm is a composite of 

1. Policy Network
2. Value Network
3. Monte Carlo tree search (MCTS)

## Installation

```
npm install
```

### Dev

```
npm start // build and launch its live dev web server.
```

After `npm start`, you can also use `VS Code` with `Debugger for Chrome` extension to debug.


### Deployment 

```
npm run deploy
```

## Features and done itmes of todo list

1. Ported the algorithms from [alpha-zero-general](https://github.com/suragnair/alpha-zero-general). Although its name is `alpha-zero-general`, it is based on AlphaGo Zero algorithm. 

2. Import pretrained models from [alpha-zero-general](https://github.com/suragnair/alpha-zero-general) and run alphago game algorithms on Browsers.
`alpha-zero-general` is a project to supply general game AI training frameworks. You can extend that project and add yourself game rule codes and train AI model
by using Python.

## TODO

1. ~~Fix bugs to train models by this JavaScript version project. It may be a TensorFlow.js bug. Maybe waitting for native TensorFlow Node.js binding is better than WebGL solution.~~
2. ~~Add UI.~~
3. Clean up.
4. Use service worker for cpu heavy loading part.
5. Use TypeScript instead

## AlphaZero

To overcome some API limitation (Tensorflow.js export/save model/weights), so this JavaScript repo borrows one of the features of AlphaZero, **always accept trained model after each iteration without comparing to previous version**


