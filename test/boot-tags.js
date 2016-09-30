const Wit     = require('../index');
const config  = require('./mock/config');
const express = require('express');
const lodash  = require('lodash');
const test    = require('tape');
var app       = express();

// init the app
Wit(app, config, function(err, wit) {

  test('boot-tags: must properly structure tags', function(t) {
    t.plan(2);
    t.ok(Array.isArray(wit.tags), 'must be an array');
    t.ok(
      lodash.isEqual(wit.tags, [ 'Alpha', 'Bravo', 'Charlie' ]),
      'must contain the correct values'
    );
  });

});
