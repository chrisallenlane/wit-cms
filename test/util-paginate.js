const configDefault = require('../app/boot-config');
const configMock    = require('./mock/config');
const lodash        = require('lodash');
const paginate      = require('../app/util-paginate');
const sort          = require('../app/util-sort');
const test          = require('tape');

// load the configs and posts
const configs = lodash.merge(configDefault, configMock);
const posts   = require('../app/boot-posts')(configs);


test('util-paginate: parameters must be optional', function(t) {
  t.plan(6);
  const paginated = paginate(posts);
  t.equals(paginated.posts.length        , 3);
  t.equals(paginated.pagination.count    , 1);
  t.equals(paginated.pagination.current  , 1);
  t.equals(paginated.pagination.next     , false);
  t.equals(paginated.pagination.previous , false);
  t.equals(paginated.pagination.perPage  , 10);
});

test('util-paginate: parameters must accept posts as an array', function(t) {
  t.plan(6);
  const paginated = paginate(sort(posts));
  t.equals(paginated.posts.length        , 3);
  t.equals(paginated.pagination.count    , 1);
  t.equals(paginated.pagination.current  , 1);
  t.equals(paginated.pagination.next     , false);
  t.equals(paginated.pagination.previous , false);
  t.equals(paginated.pagination.perPage  , 10);
});

test('util-paginate: perPage must be respected', function(t) {
  t.plan(6);
  const paginated = paginate(posts, { page: 1, perPage: 2 });
  t.equals(paginated.posts.length        , 2);
  t.equals(paginated.pagination.count    , 2);
  t.equals(paginated.pagination.current  , 1);
  t.equals(paginated.pagination.next     , 2);
  t.equals(paginated.pagination.previous , false);
  t.equals(paginated.pagination.perPage  , 2);
});

test('util-paginate: page must be respected', function(t) {
  t.plan(21);
  var paginated;

  paginated = paginate(posts, { page: 1, perPage: 1 });
  t.equals(paginated.posts.length        , 1);
  t.equals(paginated.posts[0].name       , 'post-3');
  t.equals(paginated.pagination.count    , 3);
  t.equals(paginated.pagination.current  , 1);
  t.equals(paginated.pagination.next     , 2);
  t.equals(paginated.pagination.previous , false);
  t.equals(paginated.pagination.perPage  , 1);

  paginated = paginate(posts, { page: 2, perPage: 1 });
  t.equals(paginated.posts.length        , 1);
  t.equals(paginated.posts[0].name       , 'post-2');
  t.equals(paginated.pagination.count    , 3);
  t.equals(paginated.pagination.current  , 2);
  t.equals(paginated.pagination.next     , 3);
  t.equals(paginated.pagination.previous , 1);
  t.equals(paginated.pagination.perPage  , 1);

  paginated = paginate(posts, { page: 3, perPage: 1 });
  t.equals(paginated.posts.length        , 1);
  t.equals(paginated.posts[0].name       , 'post-1');
  t.equals(paginated.pagination.count    , 3);
  t.equals(paginated.pagination.current  , 3);
  t.equals(paginated.pagination.next     , false);
  t.equals(paginated.pagination.previous , 2);
  t.equals(paginated.pagination.perPage  , 1);
});

test('util-paginate: page must default to 1 if invalid', function(t) {
  t.plan(7);
  const paginated = paginate(posts, { page: 'foo', perPage: 1 });
  t.equals(paginated.posts.length        , 1);
  t.equals(paginated.posts[0].name       , 'post-3');
  t.equals(paginated.pagination.count    , 3);
  t.equals(paginated.pagination.current  , 1);
  t.equals(paginated.pagination.next     , 2);
  t.equals(paginated.pagination.previous , false);
  t.equals(paginated.pagination.perPage  , 1);
});

test('util-paginate: page must ignore values < 1', function(t) {
  t.plan(7);
  const paginated = paginate(posts, { page: -1 });
  t.equals(paginated.posts.length        , 3);
  t.equals(paginated.posts[0].name       , 'post-3');
  t.equals(paginated.pagination.count    , 1);
  t.equals(paginated.pagination.current  , 1);
  t.equals(paginated.pagination.next     , false);
  t.equals(paginated.pagination.previous , false);
  t.equals(paginated.pagination.perPage  , 10);
});

test('util-paginate: perPage must default to 10 if invalid', function(t) {
  t.plan(7);
  const paginated = paginate(posts, { perPage: 'foo' });
  t.equals(paginated.posts.length        , 3);
  t.equals(paginated.posts[0].name       , 'post-3');
  t.equals(paginated.pagination.count    , 1);
  t.equals(paginated.pagination.current  , 1);
  t.equals(paginated.pagination.next     , false);
  t.equals(paginated.pagination.previous , false);
  t.equals(paginated.pagination.perPage  , 10);
});
