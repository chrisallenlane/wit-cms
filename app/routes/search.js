const search   = require('../util/search').search;
const config   = require('../boot/config');
const lodash   = require('lodash');
const paginate = require('../util/paginate');
const xss      = require('xss');
var configs    = config();

module.exports = function (app, wit, callback) {

  // blog search route
  app.get('/blog/search', function(req, res) {

    // sanitize the inputs (they will be fed into the response markup)
    var query = xss(req.query.q);

    // find the appropriate posts
    var posts = search(wit.posts, query);
    
    // paginate the posts
    var paginated = paginate(posts, {
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
