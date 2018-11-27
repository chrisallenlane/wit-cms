const Wit     = require('../index');
const config  = require('./mock/config');
const express = require('express');
const lodash  = require('lodash');
const test    = require('tape');
const app     = express();

// init the app
Wit(app, config, function(err, wit) {

  test('boot-pages: must properly structure pages', function(t) {
    t.plan(19);

    // enumerate the valid page properties
    const pageProperties = [
      'name',
      'url',
      'title',
      'description',
      'content',
    ];

    // assert that the correct number of pages have loaded
    t.equals(Object.keys(wit.pages).length, 3);

    // assert that each page has the correct properties
    t.equals(wit.pages['page-1'].name        , 'page-1');
    t.equals(wit.pages['page-1'].url         , '/page-1');
    t.equals(wit.pages['page-1'].title       , 'Page One');
    t.equals(wit.pages['page-1'].description , 'This is the first page.');
    t.equals(wit.pages['page-1'].content     , '<p>This is page one.</p>\n');
    t.ok(lodash.isEqual(Object.keys(wit.pages['page-1']), pageProperties));

    t.equals(wit.pages['page-2'].name        , 'page-2');
    t.equals(wit.pages['page-2'].url         , '/page-2');
    t.equals(wit.pages['page-2'].title       , 'Page Two');
    t.equals(wit.pages['page-2'].description , 'This is the second page.');
    t.equals(wit.pages['page-2'].content     , '<p>This is page two.</p>\n');
    t.ok(lodash.isEqual(Object.keys(wit.pages['page-2']), pageProperties));

    t.equals(wit.pages['page-3'].name        , 'page-3');
    t.equals(wit.pages['page-3'].url         , '/page-3');
    t.equals(wit.pages['page-3'].title       , 'Page Three');
    t.equals(wit.pages['page-3'].description , 'This is the third page.');
    t.equals(wit.pages['page-3'].content     , '<p>This is page three.</p>\n');
    t.ok(lodash.isEqual(
      Object.keys(wit.pages['page-3']).sort(),
      lodash.concat(pageProperties, 'view').sort()
    ));
  });
});
