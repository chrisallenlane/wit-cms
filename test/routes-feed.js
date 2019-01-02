const cheerio = require('cheerio');
const moment  = require('moment');
const request = require('supertest');
const test    = require('tape');

// initialize a wit app instance
const Wit    = require('../app/index');
const app    = require('./mock/app');
const config = require('./mock/config');
const wit    = Wit(app, config);


test('routes-feed: rss feed (no extension)', function(t) {
  t.plan(10);

  request(app)
    .get('/feed')
    .expect('Content-Type', /xml/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const $ = cheerio.load(res.text, { xmlMode: true });

      t.equals(
        $('rss > channel > title').text(),
        'Wit CMS Unit-Test Site',
        'must use the appropriate title'
      );
      t.equals(
        $('rss > channel > description').text(),
        'A mock site for unit-testing.',
        'must use the appropriate description'
      );
      t.equals(
        $('rss > channel > link').text(),
        'https://example.com',
        'must use the appropriate link'
      );
      t.ok(
        moment($('rss > channel > lastBuildDate').text()).isValid(),
        'must have the appropriate lastBuildDate'
      );
      t.ok(
        moment($('rss > channel > pubDate').text()).isValid(),
        'must use the appropriate pubDate'
      );

      // <item> children (first only)
      t.equals(
        $('rss > channel > item').first().find('title').text(),
        'Post Three',
        'must use the appropriate title'
      );
      t.equals(
        $('rss > channel > item').first().find('description').text(),
        'This is the third post.',
        'must use the appropriate description'
      );
      t.equals(
        $('rss > channel > item').first().find('link').text(),
        'https://example.com/blog/post/post-3',
        'must use the appropriate link'
      );
      t.ok(
        moment($('rss > channel > item').first().find('pubDate').text()).isValid(),
        'must use the appropriate pubDate'
      );
    });
});

test('routes-feed: rss feed (with extension)', function(t) {
  t.plan(10);

  request(app)
    .get('/feed.xml')
    .expect('Content-Type', /xml/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const $ = cheerio.load(res.text, { xmlMode: true });

      t.equals(
        $('rss > channel > title').text(),
        'Wit CMS Unit-Test Site',
        'must use the appropriate title'
      );
      t.equals(
        $('rss > channel > description').text(),
        'A mock site for unit-testing.',
        'must use the appropriate description'
      );
      t.equals(
        $('rss > channel > link').text(),
        'https://example.com',
        'must use the appropriate link'
      );
      t.ok(
        moment($('rss > channel > lastBuildDate').text()).isValid(),
        'must have the appropriate lastBuildDate'
      );
      t.ok(
        moment($('rss > channel > pubDate').text()).isValid(),
        'must use the appropriate pubDate'
      );

      // <item> children (first only)
      t.equals(
        $('rss > channel > item').first().find('title').text(),
        'Post Three',
        'must use the appropriate title'
      );
      t.equals(
        $('rss > channel > item').first().find('description').text(),
        'This is the third post.',
        'must use the appropriate description'
      );
      t.equals(
        $('rss > channel > item').first().find('link').text(),
        'https://example.com/blog/post/post-3',
        'must use the appropriate link'
      );
      t.ok(
        moment($('rss > channel > item').first().find('pubDate').text()).isValid(),
        'must use the appropriate pubDate'
      );
    });
});
