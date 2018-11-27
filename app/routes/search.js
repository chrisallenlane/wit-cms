const config   = require('../boot/config');
const configs  = config();
const paginate = require('../util/paginate');
const search   = require('../util/search').search;
const xss      = require('xss');

module.exports = function (app, wit, callback) {

  // blog search route
  app.get('/blog/search', function(req, res) {

    // sanitize the inputs (they will be fed into the response markup)
    const query = xss(req.query.q);

    // find the appropriate posts
    const posts = search(query, 'posts');
    
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
    const pages = search(query, 'pages');
    
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

  callback();
};
