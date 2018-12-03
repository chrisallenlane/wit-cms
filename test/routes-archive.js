const Wit     = require('../index');
const cheerio = require('cheerio');
const config  = require('./mock/config');
const express = require('express');
const lodash  = require('lodash');
const request = require('supertest');
const test    = require('tape');
const app     = require('./mock/app');

// init the app
Wit(app, config, function(err, wit) {

  // daily archive
  test('routes-archive: archive index (daily)', function(t) {
    t.plan(9);

    request(app)
      .get('/blog/archive/2016/01/01')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function(err, res) {
        t.notOk(err, 'expectations should be met');

        const $ = cheerio.load(res.text);

        t.equals(
          $('meta[name=view]').attr('content'),
          'archive',
          'must use the correct view'
        );
        t.equals(
          $('title').text(),
          'archive',
          'must have correct title'
        );
        t.equals(
          $('link[rel=canonical]').attr('href'),
          '/blog/archive/2016/01/01',
          'must have the appropriate cannonical url'
        );
        t.equals(
          $('h1').text(),
          'archive',
          'must have correct h1'
        );
        t.equals(
          $('h3').length,
          1,
          'must return the correct posts'
        );
        t.equals(
          $('span.year').text(),
          '2016',
          'must return the correct posts'
        );
        t.equals(
          $('span.month').text(),
          '01',
          'must return the correct month'
        );
        t.equals(
          $('span.day').text(),
          '01',
          'must return the correct day'
        );
    });
  });

  // monthly archive
  test('routes-archive: archive index (monthly)', function(t) {
    t.plan(9);

    request(app)
      .get('/blog/archive/2016/01')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function(err, res) {
        t.notOk(err, 'expectations should be met');

        const $ = cheerio.load(res.text);

        t.equals(
          $('meta[name=view]').attr('content'),
          'archive',
          'must use the correct view'
        );
        t.equals(
          $('title').text(),
          'archive',
          'must have correct title'
        );
        t.equals(
          $('link[rel=canonical]').attr('href'),
          '/blog/archive/2016/01',
          'must have the appropriate cannonical url'
        );
        t.equals(
          $('h1').text(),
          'archive',
          'must have correct h1'
        );
        t.equals(
          $('h3').length,
          3,
          'must return the correct posts'
        );
        t.equals(
          $('span.year').text(),
          '2016',
          'must return the correct posts'
        );
        t.equals(
          $('span.month').text(),
          '01',
          'must return the correct month'
        );
        t.equals(
          $('span.day').text(),
          '',
          'must return the correct day'
        );
    });
  });

  // yearly archive
  test('routes-archive: archive index - sort newest-first', function(t) {
    t.plan(4);

    request(app)
      .get('/blog/archive/2016')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function(err, res) {
        t.notOk(err, 'expectations should be met');

        const $ = cheerio.load(res.text);

        t.equals(
          $('h3:nth-child(1)').text(),
          'Post Three',
          'must display newest-first (1)'
        );

        t.equals(
          $('h3:nth-child(2)').text(),
          'Post Two',
          'must display newest-first (2)'
        );

        t.equals(
          $('h3:nth-child(3)').text(),
          'Post One',
          'must display newest-first (2)'
        );
    });
  });

  // yearly archive
  test('routes-archive: archive index (yearly)', function(t) {
    t.plan(9);

    request(app)
      .get('/blog/archive/2016')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function(err, res) {
        t.notOk(err, 'expectations should be met');

        const $ = cheerio.load(res.text);

        t.equals(
          $('meta[name=view]').attr('content'),
          'archive',
          'must use the correct view'
        );
        t.equals(
          $('title').text(),
          'archive',
          'must have correct title'
        );
        t.equals(
          $('link[rel=canonical]').attr('href'),
          '/blog/archive/2016',
          'must have the appropriate cannonical url'
        );
        t.equals(
          $('h1').text(),
          'archive',
          'must have correct h1'
        );
        t.equals(
          $('h3').length,
          3,
          'must return the correct posts'
        );
        t.equals(
          $('span.year').text(),
          '2016',
          'must return the correct posts'
        );
        t.equals(
          $('span.month').text(),
          '',
          'must return the correct month'
        );
        t.equals(
          $('span.day').text(),
          '',
          'must return the correct day'
        );
    });
  });

  test('routes-archive: archive malice (daily)', function(t) {
    t.plan(9);

    // NB: I'm not closing the <script> here, because the `/` would cause the
    // express URL parser to 404 the route. This partial injection is fine for
    // testing purposes, though.
    request(app)
      .get('/blog/archive/2016/01/<script>alert("xss")')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function(err, res) {
        t.notOk(err, 'expectations should be met');

        const $ = cheerio.load(res.text);

        t.equals(
          $('meta[name=view]').attr('content'),
          'archive',
          'must use the correct view'
        );
        t.equals(
          $('title').text(),
          'archive',
          'must have correct title'
        );
        t.equals(
          $('link[rel=canonical]').attr('href'),
          '/blog/archive/2016/01/%3Cscript%3Ealert(%22xss%22)',
          'must have the appropriate cannonical url'
        );
        t.equals(
          $('h1').text(),
          'archive',
          'must have correct h1'
        );
        t.equals(
          $('h3').length,
          0,
          'must return the correct posts'
        );
        t.equals(
          $('span.year').text(),
          '2016',
          'must return the correct posts'
        );
        t.equals(
          $('span.month').text(),
          '01',
          'must return the correct month'
        );
        t.equals(
          $('span.day').text(),
          '&lt;script&gt;alert("xss")',
          'must return the correct day'
        );
    });
  });

  test('routes-archive: archive malice (daily)', function(t) {
    t.plan(9);

    // NB: I'm not closing the <script> here, because the `/` would cause the
    // express URL parser to 404 the route. This partial injection is fine for
    // testing purposes, though.
    request(app)
      .get('/blog/archive/2016/<script>alert("xss")')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function(err, res) {
        t.notOk(err, 'expectations should be met');

        const $ = cheerio.load(res.text);

        t.equals(
          $('meta[name=view]').attr('content'),
          'archive',
          'must use the correct view'
        );
        t.equals(
          $('title').text(),
          'archive',
          'must have correct title'
        );
        t.equals(
          $('link[rel=canonical]').attr('href'),
          '/blog/archive/2016/%3Cscript%3Ealert(%22xss%22)',
          'must have the appropriate cannonical url'
        );
        t.equals(
          $('h1').text(),
          'archive',
          'must have correct h1'
        );
        t.equals(
          $('h3').length,
          0,
          'must return the correct posts'
        );
        t.equals(
          $('span.year').text(),
          '2016',
          'must return the correct posts'
        );
        t.equals(
          $('span.month').text(),
          '&lt;script&gt;alert("xss")',
          'must return the correct month'
        );
        t.equals(
          $('span.day').text(),
          '',
          'must return the correct day'
        );
    });
  });

  test('routes-archive: archive malice (daily)', function(t) {
    t.plan(9);

    // NB: I'm not closing the <script> here, because the `/` would cause the
    // express URL parser to 404 the route. This partial injection is fine for
    // testing purposes, though.
    request(app)
      .get('/blog/archive/<script>alert("xss")')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function(err, res) {
        t.notOk(err, 'expectations should be met');

        const $ = cheerio.load(res.text);

        t.equals(
          $('meta[name=view]').attr('content'),
          'archive',
          'must use the correct view'
        );
        t.equals(
          $('title').text(),
          'archive',
          'must have correct title'
        );
        t.equals(
          $('link[rel=canonical]').attr('href'),
          '/blog/archive/%3Cscript%3Ealert(%22xss%22)',
          'must have the appropriate cannonical url'
        );
        t.equals(
          $('h1').text(),
          'archive',
          'must have correct h1'
        );
        t.equals(
          $('h3').length,
          0,
          'must return the correct posts'
        );
        t.equals(
          $('span.year').text(),
          '&lt;script&gt;alert("xss")',
          'must return the correct posts'
        );
        t.equals(
          $('span.month').text(),
          '',
          'must return the correct month'
        );
        t.equals(
          $('span.day').text(),
          '',
          'must return the correct day'
        );
    });
  });

});
