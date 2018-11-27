const config = require('../app/boot/config');
const lodash = require('lodash');
const test   = require('tape');

/**
 * NB: these "defaults" aren't the true defaults for wit as it would likely
 * run in production, but rather, are the defaults for this testing session.
 *
 * Unfortunately, given the method by which tape runs its tests, node modules
 * are able to become "polluted" across tests. Initially, I worked around this
 * problem via the `really-need` module, but that in itself was causing further
 * problems.
 *
 * Thus, I'm satisficing for this approach. This should be OK, though, because
 * there's really not a lot of complexity to test here anyway.
 *
 */
test('boot-config: should have the appropriate defaults', function(t) {
  t.plan(18);

  const configs = config();
  t.equals(Object.keys(configs).length      , 11);
  t.equals(configs.path.asyncRoot           , '/async/');
  t.equals(configs.path.notFoundPage        , '/not-found');
  t.equals(configs.pages.dir                , './test/mock/pages/');
  t.equals(configs.posts.dir                , './test/mock/posts/');
  t.equals(configs.posts.excerpt.length     , 1);
  t.equals(configs.posts.excerpt.units      , 'paragraphs');
  t.equals(configs.posts.perPage            , 5);
  t.equals(configs.search.boost.title       , 10);
  t.equals(configs.search.boost.description , 5);
  t.equals(configs.search.boost.excerpt     , 5);
  t.equals(configs.search.boost.content     , 0);
  t.equals(configs.search.boost.author      , 0);
  t.equals(configs.dateFormat               , 'D MMMM YYYY');
  t.equals(configs.readMoreSeparator        , '<!--more-->');
  t.equals(configs.enableAsyncRoutes        , true);
  t.equals(configs.remarkable.html          , true);
  t.ok(lodash.isEqual(configs.markdownExtensions, [ 'markdown', 'md' ]));
});

test('boot-config: should allow overrides', function(t) {
  t.plan(2);

  var configs = config({ posts: { excerpt: { length: 3 } } });
  t.equals(configs.posts.excerpt.length, 3, 'when setting');

  configs = config();
  t.equals(configs.posts.excerpt.length, 3, 'when getting');
});
