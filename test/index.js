const test   = require('tape');

// initialize a wit app instance
const Wit    = require('../app/index');
const app    = require('./mock/app');
const config = require('./mock/config');


test('index: build.before should execute', function(t) {
  t.plan(1);

  // mock a build.before initilizer function
  config.build.before = function (configs, app, wit) {
    wit.executed = true;
  };

  // initialize a wit application
  const wit = Wit(app, config);

  // assert that the function executed
  t.equals(wit.executed, true);
});

test('index: build.after should execute', function(t) {
  t.plan(1);

  // mock a build.after initilizer function
  config.build.after = function (configs, app, wit) {
    wit.executed = true;
  };

  // initialize a wit application
  const wit = Wit(app, config);

  // assert that the function executed
  t.equals(wit.executed, true);
});
