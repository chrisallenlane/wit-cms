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

  test('routes-post: blog index', function(t) {
    t.plan(6);

    request(app)
      .get('/blog')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function(err, res) {
        t.notOk(err, 'expectations should be met');

        const $ = cheerio.load(res.text);

        t.equals(
          $('meta[name=view]').attr('content'),
          'blog',
          'must use the correct view'
        );
        t.equals(
          $('title').text(),
          'blog',
          'must have correct title'
        );
        t.equals(
          $('link[rel=canonical]').attr('href'),
          '/blog',
          'must have the appropriate cannonical url'
        );
        t.equals(
          $('h1').text(),
          'blog',
          'must have correct h1'
        );
        t.equals(
          $('main h2').length,
          3,
          'must load the correct number of posts'
        );
      });
  });

  test('routes-post: blog page', function(t) {
    t.plan(6);

    request(app)
      .get('/blog/post/post-1')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function(err, res) {
        t.notOk(err, 'expectations should be met');

        const $ = cheerio.load(res.text);

        t.equals(
          $('meta[name=view]').attr('content'),
          'post',
          'must use the correct view'
        );
        t.equals(
          $('title').text(),
          'Post One',
          'must have correct title'
        );
        t.equals(
          $('meta[name=description]').attr('content'),
          'This is the first post.',
          'must use the correct description'
        );
        t.equals(
          $('link[rel=canonical]').attr('href'),
          '/blog/post/post-1',
          'must have the appropriate cannonical url'
        );
        t.equals(
          $('h1').text(),
          'post-1',
          'must have correct h1'
        );
      });
  });

  test('routes-post: invalid blog page', function(t) {
    t.plan(2);

    request(app)
      .get('/blog/post/does-not-exist')
        // NB: expectation is a 302 redirect to a 'not found' page
      .expect('Content-Type', /text/)
      .expect(302)
      .end(function(err, res) {
        t.notOk(err, 'expectations should be met');
        t.equals(
          res.headers.location,
          '/not-found',
          'must redirect to the not-found page'
        );
      });
  });

});
