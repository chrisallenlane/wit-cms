const Wit     = require('../index');
const cheerio = require('cheerio');
const config  = require('./mock/config');
const express = require('express');
const lodash  = require('lodash');
const request = require('supertest');
const test    = require('tape');

var app = require('./mock/app');

// init the app
Wit(app, config, function(err, wit) {

  test('routes-tag: tag index', function(t) {
    t.plan(6);

    request(app)
      .get('/blog/tag/alpha')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function(err, res) {
        t.notOk(err, 'expectations should be met');

        var $ = cheerio.load(res.text);

        t.equals(
          $('meta[name=view]').attr('content'),
          'tag',
          'must use the correct view'
        );
        t.equals(
          $('title').text(),
          'tag',
          'must have correct title'
        );
        t.equals(
          $('link[rel=canonical]').attr('href'),
          '/blog/tag/alpha',
          'must have the appropriate cannonical url'
        );
        t.equals(
          $('h1').text(),
          'alpha',
          'must have correct h1'
        );
        t.equals(
          $('main h2').length,
          3,
          'must load the correct number of posts'
        );
      });
  });

  test('routes-tag: malicious tag', function(t) {
    t.plan(5);

    // NB: I'm not closing the <script> here, because the `/` would cause the
    // express URL parser to 404 the route. This partial injection is fine for
    // testing purposes, though.
    request(app)
      .get('/blog/tag/<script>alert("xss")')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function(err, res) {
        t.notOk(err, 'expectations should be met');

        var $ = cheerio.load(res.text);

        t.equals(
          $('meta[name=view]').attr('content'),
          'tag',
          'must use the correct view'
        );
        t.equals(
          $('title').text(),
          'tag',
          'must have correct title'
        );
        t.equals(
          $('h1').text(),
          '&lt;script&gt;alert("xss")',
          'must sanitize tag'
        );
        t.equals(
          $('h2').length,
          0,
          'must return no posts'
        );
    });
  });

});
