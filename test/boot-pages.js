const configDefault = require('../app/boot-config');
const configMock    = require('./mock/config');
const lodash        = require('lodash');
const test          = require('tape');


test('boot-pages: must properly structure pages', function(t) {
  t.plan(25);

  // load the configs
  const configs = lodash.merge(configDefault, configMock);

  // load the pages
  const pages = require('../app/boot-pages')(configs);

  // enumerate the valid page properties
  const pageProperties = [
    'name',
    'url',
    'title',
    'description',
    'content',
  ];

  // assert that the correct number of pages have loaded
  t.equals(Object.keys(pages).length, 4);

  // assert that each page has the correct properties
  t.equals(pages['page-1'].name        , 'page-1');
  t.equals(pages['page-1'].url         , '/page-1');
  t.equals(pages['page-1'].title       , 'Page One');
  t.equals(pages['page-1'].description , 'This is the first page.');
  t.equals(pages['page-1'].content     , '<p>This is page one.</p>\n');
  t.ok(lodash.isEqual(Object.keys(pages['page-1']), pageProperties));

  t.equals(pages['page-2'].name        , 'page-2');
  t.equals(pages['page-2'].url         , '/page-2');
  t.equals(pages['page-2'].title       , 'Page Two');
  t.equals(pages['page-2'].description , 'This is the second page.');
  t.equals(pages['page-2'].content     , '<p>This is page two.</p>\n');
  t.ok(lodash.isEqual(Object.keys(pages['page-2']), pageProperties));

  t.equals(pages['page-3'].name        , 'page-3');
  t.equals(pages['page-3'].url         , '/page-3');
  t.equals(pages['page-3'].title       , 'Page Three');
  t.equals(pages['page-3'].description , 'This is the third page.');
  t.equals(pages['page-3'].content     , '<p>This is page three.</p>\n');

  t.equals(pages['page-4'].name        , 'page-4');
  t.equals(pages['page-4'].url         , '/product/widgets/large');
  t.equals(pages['page-4'].title       , 'Page Four');
  t.equals(pages['page-4'].description , 'This is the fourth page.');
  t.equals(pages['page-4'].content     , '<p>This is page four.</p>\n');
  t.equals(pages['page-4'].searchable  , false);

  t.ok(lodash.isEqual(
    Object.keys(pages['page-3']).sort(),
    lodash.concat(pageProperties, 'view').sort()
  ));

});
