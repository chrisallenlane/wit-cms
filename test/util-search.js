const Wit     = require('../index');
const config  = require('./mock/config');
const express = require('express');
const lodash  = require('lodash');
const search  = require('../app/util/search').search;
const test    = require('tape');
const app     = express();

// init the app
Wit(app, config, function(err, wit) {

  test('util-search: basic functionality (posts)', function(t) {
    t.plan(2);

    var posts = search('post', 'posts');
    t.equals(posts.length, 3);

    posts = search('three', 'posts');
    t.equals(posts.length, 1);
  });

  test('util-search: should also search by author (posts)', function(t) {
    t.plan(1);

    const posts = search('john', 'posts');
    t.equals(posts.length, 3);
  });

  test('util-search: should return empty array when not found (posts)', function(t) {
    t.plan(1);

    const posts = search('not found', 'posts');
    t.equals(posts.length, 0);
  });

  test('util-search: basic functionality (pages)', function(t) {
    t.plan(2);

    var pages = search('page', 'pages');
    t.equals(pages.length, 3);

    pages = search('three', 'pages');
    t.equals(pages.length, 1);
  });

  test('util-search: should return empty array when not found (pages)', function(t) {
    t.plan(1);

    const pages = search('not found', 'pages');
    t.equals(pages.length, 0);
  });
});
