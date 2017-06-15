

# Conversation Integrator

> Low-level API to facilitate natural language interfaces.


## Example usage

```javascript

var Convo = require('convo-integrator');

var config = {
  actions: {
    say: (phrase) => {
      console.log(phrase);
    }
  },
  intents: {
    HelloIntent: {
      triggers: ['hi', 'hey', 'hello'],
      actions: [
        {say: 'hello! this worked'}
      ]
    }
  }
}

var convo = new Convo(config);
convo.prompt();

```
