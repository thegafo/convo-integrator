
const
  readline = require('readline'),
  natural = require('natural');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function Convo(config) {

  console.log('Initialized convo');

  var classifier;
  var actions = config.actions;
  var intents = config.intents;
  var prompting = false;

  if (!config || !actions || !intents) {
    throw new Error('Invalid configuration');
  }

  /**
   * train - train the classifier based on intents in configuration
   */
  function train = () => {
    classifier = new natural.BayesClassifier();
    for (intent in intents) {
      for (i in intents[intent]['triggers']) {
        classifier.addDocument(intents[intent]['triggers'][i], intent);
      }
    }
    classifier.train();
  }

  /**
   * classify - classify a phrase into an intent
   *
   * @param  {String} phrase description
   * @return {type}        description
   */
  function classify = (phrase) => {
    var classifications = classifier.getClassifications(phrase);
    console.log(classifications);

    // if first two classifications have same confidence, return false
    if (classifications[0].value == classifications[1].value) return false;

    // otherwise, return first label
    return classifications[0].label;

  }

  /**
   * execute - execute a list of actions
   *
   * @param  {List} actionList    the list of actions to execute
   * @param  {String} input       the input phrase that triggered action
   * @param  {Object} extraParams extra parameters passed by user
   */
  var execute = (actionList, input, extraParams) => {
    for (var i in actionList) {
      var action = actionList[i];
      for (var key in action) {
        if (key in actions) {
          var params = action[key];
          actions[key](params, input, extraParams);
        } else {
          throw new Error('unknown action ' + key);
        }
      }
    }
  }

  var receive = (phrase, extraParams) => {
    var intent = classify(phrase);
    if (intent) {
      execute(intents[intent]['actions'], phrase, extraParams);
    } else {
      if ('UnknownIntent' in intents) {
        execute(intents['UnknownIntent']['actions'], phrase, extraParams);
      } else {
        throw new Error('could not classify phrase; add UnknownIntent to intents to catch this error');
      }
    }
  }

  var prompt = () => {
    prompting = true;
    rl.question('>>> ', (input) => {
      prompting = false;
      receive(input);
      prompt();
    });
  }

  this.prompt = prompt;
  this.receive = receive;

  train();

}

module.exports = Convo;
