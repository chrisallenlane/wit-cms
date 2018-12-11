const archive       = require('../app/util-archive');
const configDefault = require('../app/boot-config');
const configMock    = require('./mock/config');
const lodash        = require('lodash');
const test          = require('tape');

// load the configs and posts
const configs = lodash.merge(configDefault, configMock);
const posts   = require('../app/boot-posts')(configs);


test('util-archive: filter by year', function(t) {
  t.plan(1);

  const archived = archive(posts, {
    year: '2016',
  });

  t.equals(archived.length, 3);
});

test('util-archive: filter by month', function(t) {
  t.plan(1);

  const archived = archive(posts, {
    year  : '2016',
    month : '01',
  });

  t.equals(archived.length, 3);
});

test('util-archive: filter by day', function(t) {
  t.plan(1);

  const archived = archive(posts, {
    year  : '2016',
    month : '01',
    day   : '01',
  });

  t.equals(archived.length, 1);
});

test('util-archive: no posts found must return empty array', function(t) {
  t.plan(1);

  const archived = archive(posts, {
    year  : '9999',
  });

  t.equals(archived.length, 0);
});

test('util-archive: must accept arguments as numbers (year)', function(t) {
  t.plan(1);

  const archived = archive(posts, {
    year  : 2016,
  });

  t.equals(archived.length, 3);
});

test('util-archive: must accept arguments as numbers (month)', function(t) {
  t.plan(1);

  const archived = archive(posts, {
    year  : 2016,
    month : 1,
  });

  t.equals(archived.length, 3);
});

test('util-archive: must accept arguments as numbers (day)', function(t) {
  t.plan(1);

  const archived = archive(posts, {
    year  : 2016,
    month : 1,
    day   : 1,
  });

  t.equals(archived.length, 1);
});
