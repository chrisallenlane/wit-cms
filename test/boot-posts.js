const Wit     = require('../index');
const config  = require('./mock/config');
const express = require('express');
const lodash  = require('lodash');
const test    = require('tape');
const app     = express();

// init the app
Wit(app, config, function(err, wit) {

  test('boot-posts: must properly structure posts', function(t) {
    t.plan(31);

    // assert that the correct number of posts have loaded
    t.equals(Object.keys(wit.posts).length, 3);

    // enumerate the valid post properties
    const postProperties = [ 
      'name',
      'url',
      'title',
      'author',
      'description',
      'categories',
      'tags',
      'date',
      'content',
      'excerpt',
    ];

    // assert that each post has the correct properties
    t.equals(wit.posts['post-1'].name        , 'post-1');
    t.equals(wit.posts['post-1'].url         , '/blog/post/post-1');
    t.equals(wit.posts['post-1'].title       , 'Post One');
    t.equals(wit.posts['post-1'].author      , 'John Doe');
    t.equals(wit.posts['post-1'].description , 'This is the first post.');
    t.equals(wit.posts['post-1'].content     , '<p>This is post one.</p>\n');
    t.ok(lodash.isEqual(Object.keys(wit.posts['post-1']), postProperties));
    t.ok(lodash.isEqual(wit.posts['post-1'].categories, [ 'foo', 'bar' ]));
    t.ok(lodash.isEqual(wit.posts['post-1'].tags, [ 'alpha', 'bravo', 'charlie' ]));
    t.ok(wit.posts['post-1'].date);

    t.equals(wit.posts['post-2'].name        , 'post-2');
    t.equals(wit.posts['post-2'].url         , '/blog/post/post-2');
    t.equals(wit.posts['post-2'].title       , 'Post Two');
    t.equals(wit.posts['post-2'].author      , 'John Doe');
    t.equals(wit.posts['post-2'].description , 'This is the second post.');
    t.equals(wit.posts['post-2'].content     , '<p>This is post two.</p>\n');
    t.ok(lodash.isEqual(Object.keys(wit.posts['post-2']), postProperties));
    t.ok(lodash.isEqual(wit.posts['post-2'].categories, [ 'bar', 'baz' ]));
    t.ok(lodash.isEqual(wit.posts['post-2'].tags, [ 'alpha', 'bravo' ]));
    t.ok(wit.posts['post-2'].date);

    t.equals(wit.posts['post-3'].name        , 'post-3');
    t.equals(wit.posts['post-3'].url         , '/blog/post/post-3');
    t.equals(wit.posts['post-3'].title       , 'Post Three');
    t.equals(wit.posts['post-3'].author      , 'John Doe');
    t.equals(wit.posts['post-3'].description , 'This is the third post.');
    t.equals(wit.posts['post-3'].content     , '<p>This is post three.</p>\n');
    t.ok(lodash.isEqual(Object.keys(wit.posts['post-3']), postProperties));
    t.ok(lodash.isEqual(wit.posts['post-3'].categories, [ 'baz' ]));
    t.ok(lodash.isEqual(wit.posts['post-3'].tags, [ 'alpha' ]));
    t.ok(wit.posts['post-3'].date);
  });

});
