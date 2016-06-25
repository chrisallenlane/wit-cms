const Wit     = require('../index');
const config  = require('./mock/config');
const express = require('express');
const lodash  = require('lodash');
const sort    = require('../app/util/sort');
const test    = require('tape');

var app       = express();

// init the app
Wit(app, config, function(err, wit) {

  test('util-sort: must properly sort posts', function(t) {
    var posts = sort(wit.posts);

    t.plan(3);
    t.equals(posts[0].name, 'post-3');
    t.equals(posts[1].name, 'post-2');
    t.equals(posts[2].name, 'post-1');
  });

});
