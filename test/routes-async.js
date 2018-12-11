const cheerio = require('cheerio');
const lodash  = require('lodash');
const request = require('supertest');
const test    = require('tape');

// initialize a wit app instance
const Wit    = require('../app/index');
const app    = require('./mock/app');
const config = require('./mock/config');
const wit    = Wit(app, config);


test('routes-async: params', function(t) {
  t.plan(5);

  request(app)
    .get('/async/params')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.ok(json.params, 'should have a params property');
      t.equals(Object.keys(json).length, 1, 'should have correct keys');
      t.equals(json.params.author, 'John Doe', 'should pass correct values');
      t.equals(json.params.fqdn, 'https://example.com', 'should pass correct values');
    });
});

test('routes-async: all pages', function(t) {
  t.plan(4);

  request(app)
    .get('/async/pages')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.ok(json.pages, 'should have a pages property');
      t.equals(Object.keys(json).length, 1 , 'should have correct keys');
      t.equals(Object.keys(json.pages).length, 3, 'should return all pages');
    });
});

test('routes-async: individual pages', function(t) {
  t.plan(4);

  request(app)
    .get('/async/pages/page-1')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.ok(json.page, 'should have a page property');
      t.equals(Object.keys(json).length, 1 ,'should have correct keys');
      t.equals(json.page.name, 'page-1', 'should return requested page');
    });
});

test('routes-async: invalid pages', function(t) {
  t.plan(3);

  request(app)
    .get('/async/pages/not-a-page')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(Object.keys(json).length, 1, 'should have correct number of keys');
      t.equals(json.error, 'not found', 'should have appropriate error message');
    });
});

test('routes-async: all posts (raw)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(Object.keys(json).length, 1, 'should have correct number of keys');
      t.equals(Object.keys(json.posts).length, 3, 'should return all posts');
    });
});

test('routes-async: all posts (paginated)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog?p=1')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.ok(
        lodash.isEqual(Object.keys(json), [ 'pagination', 'posts' ]),
        'should return posts and pagination'
      );
      t.equals(json.posts.length, 3, 'should return all posts');
    });
});

test('routes-async: individual posts', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog/post/post-1')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(Object.keys(json).length, 1 , 'should have correct keys');
      t.equals(json.post.name, 'post-1', 'should return appropriate post');
    });
});

test('routes-async: invalid posts', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog/post/not-a-post')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(Object.keys(json).length, 1, 'should have correct number of keys');
      t.equals(json.error, 'not found', 'should have appropriate error message');
    });
});

test('routes-async: posts by archive (yearly) (all)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog/archive/2016/')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(Object.keys(json).length, 1, 'should return appropriate json');
      t.equals(json.posts.length, 3, 'should return appropriate posts');
    });
});

test('routes-async: posts by archive (monthly) (all)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog/archive/2016/01')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(Object.keys(json).length, 1, 'should return appropriate json');
      t.equals(json.posts.length, 3, 'should return appropriate posts');
    });
});

test('routes-async: posts by archive (daily) (all)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog/archive/2016/01/01')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(Object.keys(json).length, 1, 'should return appropriate json');
      t.equals(json.posts.length, 1, 'should return appropriate posts');
    });
});

test('routes-async: posts by archive (yearly) (paginated)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog/archive/2016?p=1')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(json.posts.length, 3, 'should return appropriate posts');
      t.ok(
        lodash.isEqual(Object.keys(json), [ 'pagination', 'posts' ]),
        'should return posts and pagination'
      );
    });
});

test('routes-async: posts by archive (monthly) (paginated)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog/archive/2016/01?p=1')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(json.posts.length, 3, 'should return appropriate posts');
      t.ok(
        lodash.isEqual(Object.keys(json), [ 'pagination', 'posts' ]),
        'should return posts and pagination'
      );
    });
});

test('routes-async: posts by archive (daily) (paginated)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog/archive/2016/01/01?p=1')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(json.posts.length, 1, 'should return appropriate posts');
      t.ok(
        lodash.isEqual(Object.keys(json), [ 'pagination', 'posts' ]),
        'should return posts and pagination'
      );
    });
});

test('routes-async: posts by archive (invalid) (all)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog/archive/9999/')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(Object.keys(json).length, 1, 'should return appropriate json');
      t.equals(json.error, 'not found', 'should have appropriate error message');
    });
});

test('routes-async: posts by archive (invalid) (paginated)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog/archive/9999?p=1')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(Object.keys(json).length, 1, 'should return appropriate json');
      t.equals(json.error, 'not found', 'should have appropriate error message');
    });
});

test('routes-async: posts by tag (all)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog/tag/alpha')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(Object.keys(json).length, 1, 'should return appropriate json');
      t.equals(json.posts.length, 3, 'should return appropriate posts');
    });
});

test('routes-async: posts by tag (paginated)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog/tag/alpha?p=1')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(json.posts.length, 3, 'should return appropriate posts');
      t.ok(
        lodash.isEqual(Object.keys(json), [ 'pagination', 'posts' ]),
        'should return posts and pagination'
      );
    });
});

test('routes-async: posts by category (all)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog/category/foo')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(Object.keys(json).length, 1, 'should return appropriate json');
      t.equals(json.posts.length, 1, 'should return appropriate posts');
    });
});

test('routes-async: posts by category (paginated)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog/category/foo?p=1')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(json.posts.length, 1, 'should return appropriate posts');
      t.ok(
        lodash.isEqual(Object.keys(json), [ 'pagination', 'posts' ]),
        'should return posts and pagination'
      );
    });
});

test('routes-async: categories', function(t) {
  t.plan(3);

  request(app)
    .get('/async/categories')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(Object.keys(json).length, 1, 'should return appropriate json');
      t.ok(
        lodash.isEqual(json.categories, [ 'bar', 'baz', 'foo' ]),
        'should return the categories'
      );
    });
});

test('routes-async: tags', function(t) {
  t.plan(3);

  request(app)
    .get('/async/tags')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);
      t.equals(Object.keys(json).length, 1, 'should return appropriate json');
      t.ok(
        lodash.isEqual(json.tags, [ 'alpha', 'bravo', 'charlie' ]),
        'should return the tags'
      );
    });
});

test('routes-async: posts by search (raw)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog/search?q=john')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);

      t.equals(json.posts.length, 3, 'should return appropriate posts');
      t.ok(
        lodash.isEqual(Object.keys(json), [ 'posts' ]),
        'should return posts and pagination'
      );
    });
});

test('routes-async: posts by search (paginated)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/blog/search?q=john&p=1')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);

      t.equals(json.posts.length, 3, 'should return appropriate posts');
      t.ok(
        lodash.isEqual(Object.keys(json), [ 'pagination', 'posts' ]),
        'should return posts and pagination'
      );
    });
});

test('routes-async: pages by search (raw)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/pages/search?q=page')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);

      t.equals(json.pages.length, 3, 'should return appropriate pages');
      t.ok(
        lodash.isEqual(Object.keys(json), [ 'pages' ]),
        'should return pages and pagination'
      );
    });
});


test('routes-async: pages by search (paginated)', function(t) {
  t.plan(3);

  request(app)
    .get('/async/pages/search?q=third&p=1')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      t.notOk(err, 'expectations should be met');

      const json = JSON.parse(res.text);

      t.equals(json.pages.length, 1, 'should return appropriate pages');
      t.ok(
        lodash.isEqual(Object.keys(json), [ 'pagination', 'pages' ]),
        'should return pages and pagination'
      );
    });
});
