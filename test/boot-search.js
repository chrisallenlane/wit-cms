const boot          = require('../app/boot-search');
const configDefault = require('../app/boot-config');
const configMock    = require('./mock/config');
const lodash        = require('lodash');
const search        = require('../app/util-search');
const test          = require('tape');


test('boot-search: must return correct search results', function(t) {
  t.plan(1);

  // load the configs
  const configs = lodash.merge(configDefault, configMock);

  // load the pages
  const pages = require('../app/boot-pages')(configs);

  // build an index
  const idx = boot(configs, pages);

  // assert that the search returns the proper result
  const results = search('one', pages, idx);
  t.equals(results[0].title, "Page One");
});

test('boot-search: must exclude non-searchable content', function(t) {
  t.plan(1);

  // load the configs
  const configs = lodash.merge(configDefault, configMock);

  // load the pages
  const pages = require('../app/boot-pages')(configs);

  // build an index
  const idx = boot(configs, pages);

  // assert that the search returns the proper result
  const results = search('four', pages, idx);
  t.equals(results.length, 0);
});
