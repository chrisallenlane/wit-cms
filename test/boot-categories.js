const Wit     = require('../index');
const config  = require('./mock/config');
const express = require('express');
const lodash  = require('lodash');
const test    = require('tape');
const app     = express();

// init the app
Wit(app, config, function(err, wit) {

  test('boot-categories: must properly structure categories', function(t) {
    t.plan(2);
    t.ok(Array.isArray(wit.categories), 'must be an array');
    t.ok(
      lodash.isEqual(wit.categories, [ 'bar', 'baz', 'foo' ]),
      'must contain the correct values'
    );
  });

});
