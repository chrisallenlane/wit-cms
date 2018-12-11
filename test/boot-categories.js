const Categories    = require('../app/boot-categories');
const configDefault = require('../app/boot-config');
const configMock    = require('./mock/config');
const lodash        = require('lodash');
const test          = require('tape');


test('boot-categories: must properly structure categories', function(t) {
  t.plan(2);

  // load the configs
  const configs = lodash.merge(configDefault, configMock);

  // load the posts
  const posts = require('../app/boot-posts')(configs);

  // construct categories
  const categories = Categories(posts);

  t.ok(Array.isArray(categories), 'must be an array');
  t.ok(
    lodash.isEqual(categories, [ 'bar', 'baz', 'foo' ]),
    'must contain the correct values'
  );
});
