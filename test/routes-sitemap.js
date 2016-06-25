const Wit     = require('../index');
const cheerio = require('cheerio');
const config  = require('./mock/config');
const express = require('express');
const lodash  = require('lodash');
const request = require('supertest');
const test    = require('tape');
const moment  = require('moment');

var app = require('./mock/app');

// init the app
Wit(app, config, function(err, wit) {

  test('routes-sitemap: rss feed', function(t) {
    t.plan(5);

    request(app)
      .get('/sitemap.xml')
      .expect('Content-Type', /xml/)
      .expect(200)
      .end(function(err, res) {
        t.notOk(err, 'expectations should be met');

        var $ = cheerio.load(res.text, { xmlMode: true });

        t.equals(
          $('urlset > url').first().find('loc').text(),
          'https://example.com/page-1',
          'must have the appropriate loc'
        );
        t.ok(
          moment($('urlset > url').first().find('lastmod').text()).isValid(),
          'must have the appropriate lastmod'
        );
        t.equals(
          $('urlset > url').first().find('changefreq').text(),
          'daily',
          'must have the appropriate changefreq'
        );
        t.equals(
          $('urlset > url').first().find('priority').text(),
          '1.0',
          'must have the appropriate priority'
        );
      });
  });

});
