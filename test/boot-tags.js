const Tags          = require('../app/boot-tags');
const configDefault = require('../app/boot-config');
const configMock    = require('./mock/config');
const lodash        = require('lodash');
const test          = require('tape');


test('boot-tags: must properly structure tags', function(t) {
  t.plan(2);

  // load the configs
  const configs = lodash.merge(configDefault, configMock);

  // load the posts
  const posts = require('../app/boot-posts')(configs);

  // construct tags
  const tags = Tags(posts);

  t.ok(Array.isArray(tags), 'must be an array');
  t.ok(
    lodash.isEqual(tags, [ 'alpha', 'bravo', 'charlie' ]),
    'must contain the correct values'
  );
});
