const Wit     = require('../index');
const config  = require('./mock/config');
const express = require('express');
const lodash  = require('lodash');
const test    = require('tape');

var app       = express();

// init the app
Wit(app, config, function(err, wit) {

  test('index: custom properties must bind', function(t) {
    t.plan(3);
    t.ok(wit.params, 'must have bound');
    t.equals(wit.params.author, 'John Doe', 'must have correct value');
    t.equals(wit.params.fqdn, 'https://example.com', 'must have correct value');
  });

  test('index: user-specified "init" function', function(t) {
    t.plan(1);
    t.equals(wit.foo, 'bar', 'must provide for mutations on the wit object');
  });

});
