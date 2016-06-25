const Wit     = require('../index');
const config  = require('./mock/config');
const express = require('express');
const lodash  = require('lodash');
const search  = require('../app/util/search').search;
const test    = require('tape');

var app       = express();

// init the app
Wit(app, config, function(err, wit) {

  test('util-search: basic functionality', function(t) {
    t.plan(2);

    var posts = search(wit.posts, 'post');
    t.equals(posts.length, 3);

    posts = search(wit.posts, 'three');
    t.equals(posts.length, 1);
  });

  test('util-search: should also search by author', function(t) {
    t.plan(1);

    var posts = search(wit.posts, 'john');
    t.equals(posts.length, 3);
  });

  test('util-search: should return empty array when not found', function(t) {
    t.plan(1);

    var posts = search(wit.posts, 'not found');
    t.equals(posts.length, 0);
  });

});
