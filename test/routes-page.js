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

  test('routes-page: basic behavior', function(t) {
    t.plan(7);

    request(app)
      .get('/page-1')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function(err, res) {
        t.notOk(err, 'expectations should be met');

        const $ = cheerio.load(res.text);

        t.equals(
          $('meta[name=view]').attr('content'),
          'page',
          'must use the correct view'
        );
        t.equals(
          $('title').text(),
          'Page One',
          'must have correct title'
        );
        t.equals(
          $('meta[name=description]').attr('content'),
          'This is the first page.',
          'must use the correct description'
        );
        t.equals(
          $('link[rel=canonical]').attr('href'),
          '/page-1',
          'must have the appropriate cannonical url'
        );
        t.equals(
          $('h1').text(),
          'page-1',
          'must have correct h1'
        );
        t.equals(
          $('p').text(),
          'This is page one.',
          'must have correct content'
        );
      });
  });

  test('routes-page: view overide', function(t) {
    t.plan(2);

    request(app)
      .get('/page-3')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function(err, res) {
        t.notOk(err, 'expectations should be met');

        const $ = cheerio.load(res.text);

        t.equals(
          $('meta[name=view]').attr('content'),
          'special',
          'must respect view overrides'
        );
      });
  });
});
