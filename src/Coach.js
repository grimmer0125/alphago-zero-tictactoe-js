export default class Coach {
  constructor(game, nnet, args) {
    console.log('Coach constructer');
  }

  // used by learn()
  executeEpisode() {

  }

  learn() {

  }

  // return filename
  getCheckpointFile(iteration) {
    // return 'checkpoint_' + str(iteration) + '.pth.tar'
    return '';
  }

  // TODO: low priority
  saveTrainExamples() {

  }

  // TODO: low priority
  loadTrainExamples() {

  }
}
