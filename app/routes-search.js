const lodash   = require('lodash');
const paginate = require('./util-paginate');
const search   = require('./util-search');
const xss      = require('xss');

module.exports = function (configs, app, wit) {

  // blog search route
  app.get('/blog/search', function(req, res) {

    // sanitize the inputs (they will be fed into the response markup)
    const query = xss(req.query.q);

    // find the appropriate posts
    const posts = search(query, wit.posts, wit.index.post);

    // paginate the posts
    const paginated = paginate(posts, {
      page    : req.query.p,
      perPage : configs.posts.perPage,
    });

    res.render('search', {
      page : {
        title      : 'search',
        name       : query,
        url        : xss(req.url),
        content    : paginated.posts,
        pagination : paginated.pagination,
      },
      wit : wit,
    });
  });

  // page search route
  app.get('/page/search', function(req, res) {

    // sanitize the inputs (they will be fed into the response markup)
    const query = xss(req.query.q);

    // find the appropriate pages
    const pages = search(query, wit.pages, wit.index.page);

    // paginate the pages
    const paginated = paginate(pages, {
      page    : req.query.p,
      perPage : configs.posts.perPage,
    });

    res.render('search', {
      page : {
        title      : 'search',
        name       : query,
        url        : xss(req.url),
        content    : paginated.posts,
        pagination : paginated.pagination,
      },
      wit : wit,
    });
  });

  // all search route
  app.get('/search', function(req, res) {

    // sanitize the inputs (they will be fed into the response markup)
    const query = xss(req.query.q);

    // Combine the pages and posts into a single corpus
    //
    // NB: it's computationally inefficient to re-assemble this
    // collection with each search, but it may not be worth the
    // RAM to keep it bufferred.
    const combined = {};
    lodash.assign(combined, wit.pages, wit.posts);

    // find the appropriate pages and posts
    const pages = search(query, combined, wit.index.all);

    // paginate the pages
    const paginated = paginate(pages, {
      page    : req.query.p,
      perPage : configs.posts.perPage,
    });

    res.render('search', {
      page : {
        title      : 'search',
        name       : query,
        url        : xss(req.url),
        content    : paginated.posts,
        pagination : paginated.pagination,
      },
      wit : wit,
    });
  });
};
