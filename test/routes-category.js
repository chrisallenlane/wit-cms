const cheerio = require('cheerio');
const request = require('supertest');
const test    = require('tape');

// initialize a wit app instance
const Wit    = require('../app/index');
const app    = require('./mock/app');
const config = require('./mock/config');
const wit    = Wit(app, config);


test('routes-category: category index', function(t) {
  t.plan(6);

  request(app)
    .get('/blog/category/foo')
    .expect('Content-Type', /html/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const $ = cheerio.load(res.text);

      t.equals(
        $('meta[name=view]').attr('content'),
        'category',
        'must use the correct view'
      );
      t.equals(
        $('title').text(),
        'category',
        'must have correct title'
      );
      t.equals(
        $('link[rel=canonical]').attr('href'),
        '/blog/category/foo',
        'must have the appropriate cannonical url'
      );
      t.equals(
        $('h1').text(),
        'foo',
        'must have correct h1'
      );
      t.equals(
        $('h2').text(),
        'Post One',
        'must have correct h2'
      );
    });
});

test('routes-category: category index - sort newest-first', function(t) {
  t.plan(3);

  request(app)
    .get('/blog/category/bar')
    .expect('Content-Type', /html/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const $ = cheerio.load(res.text);

      t.equals(
        $('h2:nth-child(1)').text(),
        'Post Two',
        'must display newest-first (1)'
      );

      t.equals(
        $('h2:nth-child(2)').text(),
        'Post One',
        'must display newest-first (2)'
      );
    });
});

test('routes-category: malicious category', function(t) {
  t.plan(1);

  request(app)
    .get('/blog/category/<script>alert("xss");</script>')
    .expect('Content-Type', /html/)
    .expect(404)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');
  });
});

test('routes-category: malicious category', function(t) {
  t.plan(5);

  // NB: I'm not closing the <script> here, because the `/` would cause the
  // express URL parser to 404 the route. This partial injection is fine for
  // testing purposes, though.
  request(app)
    .get('/blog/category/<script>alert("xss")')
    .expect('Content-Type', /html/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const $ = cheerio.load(res.text);

      t.equals(
        $('meta[name=view]').attr('content'),
        'category',
        'must use the correct view'
      );
      t.equals(
        $('title').text(),
        'category',
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
