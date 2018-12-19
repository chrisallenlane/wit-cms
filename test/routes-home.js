const cheerio = require('cheerio');
const request = require('supertest');
const test    = require('tape');

// initialize a wit app instance
const Wit    = require('../app/index');
const app    = require('./mock/app');


test('routes-home: should not redirect by default', function (t) {
  t.plan(1);

  // initialize the configs
  const config = require('./mock/config');

  // initialize a wit object
  const wit    = Wit(app, config);

  request(app)
    .get('/')
    .expect(404)
    .end(function(err, res) {
      t.notOk(err);
  });
});

test('routes-home: should redirect when so configured', function (t) {
  t.plan(2);

  // append the `pages.home` config
  const config      = require('./mock/config');
  config.pages.home = '/page-1';

  // initialize a wit object
  const wit         = Wit(app, config);

  request(app)
    .get('/')
    .expect(302)
    .end(function(err, res) {
      t.notOk(err);
      t.equals(res.header.location, '/page-1');
  });
});
