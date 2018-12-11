const configDefault = require('../app/boot-config');
const configMock    = require('./mock/config');
const lodash        = require('lodash');
const sort          = require('../app/util-sort');
const test          = require('tape');


test('util-sort: must properly sort posts', function(t) {
  t.plan(3);

  // load the configs and posts
  const configs = lodash.merge(configDefault, configMock);
  const posts   = require('../app/boot-posts')(configs);

  // sort the posts
  const sorted = sort(posts);

  // assertions
  t.equals(sorted[0].name, 'post-3');
  t.equals(sorted[1].name, 'post-2');
  t.equals(sorted[2].name, 'post-1');
});
