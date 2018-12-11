const cheerio = require('cheerio');
const request = require('supertest');
const test    = require('tape');

// initialize a wit app instance
const Wit    = require('../app/index');
const app    = require('./mock/app');
const config = require('./mock/config');
const wit    = Wit(app, config);


test('routes-search: search index (posts)', function(t) {
  t.plan(6);

  request(app)
    .get('/blog/search')
    .query({ q: 'three' })
    .expect('Content-Type', /html/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const $ = cheerio.load(res.text);

      t.equals(
        $('meta[name=view]').attr('content'),
        'search',
        'must use the correct view'
      );
      t.equals(
        $('title').text(),
        'search',
        'must have correct title'
      );
      t.equals(
        $('link[rel=canonical]').attr('href'),
        '/blog/search?q=three',
        'must have the appropriate cannonical url'
      );
      t.equals(
        $('h1').text(),
        'three',
        'must have correct h1'
      );
      t.equals(
        $('h2').length,
        1,
        'must return the correct posts'
      );
  });
});

test('routes-search: invalid search (posts)', function(t) {
  t.plan(6);

  request(app)
    .get('/blog/search')
    .query({ q: 'quux' })
    .expect('Content-Type', /html/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const $ = cheerio.load(res.text);

      t.equals(
        $('meta[name=view]').attr('content'),
        'search',
        'must use the correct view'
      );
      t.equals(
        $('title').text(),
        'search',
        'must have correct title'
      );
      t.equals(
        $('link[rel=canonical]').attr('href'),
        '/blog/search?q=quux',
        'must have the appropriate cannonical url'
      );
      t.equals(
        $('h1').text(),
        'quux',
        'must have correct h1'
      );
      t.equals(
        $('h2').length,
        0,
        'must return no posts'
      );
  });
});

test('routes-search: malicious search (posts)', function(t) {
  t.plan(5);

  request(app)
    .get('/blog/search')
    .query({ q: '<script>alert("xss")</script>' })
    .expect('Content-Type', /html/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const $ = cheerio.load(res.text);

      t.equals(
        $('meta[name=view]').attr('content'),
        'search',
        'must use the correct view'
      );
      t.equals(
        $('title').text(),
        'search',
        'must have correct title'
      );
      t.equals(
        $('h1').text(),
        '&lt;script&gt;alert("xss")&lt;/script&gt;',
        'must sanitize search query'
      );
      t.equals(
        $('h2').length,
        0,
        'must return no posts'
      );
  });
});

test('routes-search: search index (pages)', function(t) {
  t.plan(6);

  request(app)
    .get('/page/search')
    .query({ q: 'third' })
    .expect('Content-Type', /html/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const $ = cheerio.load(res.text);

      t.equals(
        $('meta[name=view]').attr('content'),
        'search',
        'must use the correct view'
      );
      t.equals(
        $('title').text(),
        'search',
        'must have correct title'
      );
      t.equals(
        $('link[rel=canonical]').attr('href'),
        '/page/search?q=third',
        'must have the appropriate cannonical url'
      );
      t.equals(
        $('h1').text(),
        'third',
        'must have correct h1'
      );
      t.equals(
        $('h2').length,
        1,
        'must return the correct pages'
      );
  });
});

test('routes-search: invalid search (pages)', function(t) {
  t.plan(6);

  request(app)
    .get('/page/search')
    .query({ q: 'quux' })
    .expect('Content-Type', /html/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const $ = cheerio.load(res.text);

      t.equals(
        $('meta[name=view]').attr('content'),
        'search',
        'must use the correct view'
      );
      t.equals(
        $('title').text(),
        'search',
        'must have correct title'
      );
      t.equals(
        $('link[rel=canonical]').attr('href'),
        '/page/search?q=quux',
        'must have the appropriate cannonical url'
      );
      t.equals(
        $('h1').text(),
        'quux',
        'must have correct h1'
      );
      t.equals(
        $('h2').length,
        0,
        'must return no posts'
      );
  });
});

test('routes-search: malicious search (pages)', function(t) {
  t.plan(5);

  request(app)
    .get('/page/search')
    .query({ q: '<script>alert("xss")</script>' })
    .expect('Content-Type', /html/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const $ = cheerio.load(res.text);

      t.equals(
        $('meta[name=view]').attr('content'),
        'search',
        'must use the correct view'
      );
      t.equals(
        $('title').text(),
        'search',
        'must have correct title'
      );
      t.equals(
        $('h1').text(),
        '&lt;script&gt;alert("xss")&lt;/script&gt;',
        'must sanitize search query'
      );
      t.equals(
        $('h2').length,
        0,
        'must return no posts'
      );
  });
});
