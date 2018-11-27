const Wit     = require('../index');
const config  = require('./mock/config');
const express = require('express');
const lodash  = require('lodash');
const archive = require('../app/util/archive');
const test    = require('tape');
const app     = express();

// init the app
Wit(app, config, function(err, wit) {

  test('util-archive: filter by year', function(t) {
    t.plan(1);

    const posts = archive(wit.posts, {
      year: '2016',
    });

    t.equals(posts.length, 3);
  });

  test('util-archive: filter by month', function(t) {
    t.plan(1);

    const posts = archive(wit.posts, {
      year  : '2016',
      month : '01',
    });

    t.equals(posts.length, 3);
  });

  test('util-archive: filter by day', function(t) {
    t.plan(1);

    const posts = archive(wit.posts, {
      year  : '2016',
      month : '01',
      day   : '01',
    });

    t.equals(posts.length, 1);
  });

  test('util-archive: no posts found must return empty array', function(t) {
    t.plan(1);

    const posts = archive(wit.posts, {
      year  : '9999',
    });

    t.equals(posts.length, 0);
  });

  test('util-archive: must accept arguments as numbers (year)', function(t) {
    t.plan(1);

    const posts = archive(wit.posts, {
      year  : 2016,
    });

    t.equals(posts.length, 3);
  });

  test('util-archive: must accept arguments as numbers (month)', function(t) {
    t.plan(1);

    const posts = archive(wit.posts, {
      year  : 2016,
      month : 1,
    });

    t.equals(posts.length, 3);
  });

  test('util-archive: must accept arguments as numbers (day)', function(t) {
    t.plan(1);

    const posts = archive(wit.posts, {
      year  : 2016,
      month : 1,
      day   : 1,
    });

    t.equals(posts.length, 1);
  });

});
