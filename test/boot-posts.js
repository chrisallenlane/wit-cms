const configDefault = require('../app/boot-config');
const configMock    = require('./mock/config');
const lodash        = require('lodash');
const test          = require('tape');


test('boot-posts: must properly structure posts', function(t) {
  t.plan(31);

  // load the configs
  const configs = lodash.merge(configDefault, configMock);

  // load the pages
  const posts = require('../app/boot-posts')(configs);

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

  // assert that the correct number of posts have loaded
  t.equals(Object.keys(posts).length, 3);

  // assert that each post has the correct properties
  t.equals(posts['post-1'].name        , 'post-1');
  t.equals(posts['post-1'].url         , '/blog/post/post-1');
  t.equals(posts['post-1'].title       , 'Post One');
  t.equals(posts['post-1'].author      , 'John Doe');
  t.equals(posts['post-1'].description , 'This is the first post.');
  t.equals(posts['post-1'].content     , '<p>This is post one.</p>\n');
  t.ok(lodash.isEqual(Object.keys(posts['post-1']), postProperties));
  t.ok(lodash.isEqual(posts['post-1'].categories, [ 'foo', 'bar' ]));
  t.ok(lodash.isEqual(posts['post-1'].tags, [ 'alpha', 'bravo', 'charlie' ]));
  t.ok(posts['post-1'].date);

  t.equals(posts['post-2'].name        , 'post-2');
  t.equals(posts['post-2'].url         , '/blog/post/post-2');
  t.equals(posts['post-2'].title       , 'Post Two');
  t.equals(posts['post-2'].author      , 'John Doe');
  t.equals(posts['post-2'].description , 'This is the second post.');
  t.equals(posts['post-2'].content     , '<p>This is post two.</p>\n');
  t.ok(lodash.isEqual(Object.keys(posts['post-2']), postProperties));
  t.ok(lodash.isEqual(posts['post-2'].categories, [ 'bar', 'baz' ]));
  t.ok(lodash.isEqual(posts['post-2'].tags, [ 'alpha', 'bravo' ]));
  t.ok(posts['post-2'].date);

  t.equals(posts['post-3'].name        , 'post-3');
  t.equals(posts['post-3'].url         , '/blog/post/post-3');
  t.equals(posts['post-3'].title       , 'Post Three');
  t.equals(posts['post-3'].author      , 'John Doe');
  t.equals(posts['post-3'].description , 'This is the third post.');
  t.equals(posts['post-3'].content     , '<p>This is post three.</p>\n');
  t.ok(lodash.isEqual(Object.keys(posts['post-3']), postProperties));
  t.ok(lodash.isEqual(posts['post-3'].categories, [ 'baz' ]));
  t.ok(lodash.isEqual(posts['post-3'].tags, [ 'alpha' ]));
  t.ok(posts['post-3'].date);
});

