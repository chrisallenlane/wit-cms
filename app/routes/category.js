const config   = require('../boot/config');
const lodash   = require('lodash');
const paginate = require('../util/paginate');
const xss      = require('xss');
var configs    = config();

module.exports = function(app, wit, callback) {

  // category index page
  app.get('/blog/category/:category', function(req, res) {

    // sanitize the input (it will be fed into the response markup)
    var category = xss(req.params.category);

    // find the appropriate posts
    var posts    = lodash.filter(wit.posts, { categories: [ category ]});

    // paginate the posts
    var paginated = paginate(posts, {
      page    : req.query.p,
      perPage : configs.posts.perPage,
    });

    res.render('category', {
      page : {
        title      : 'category',
        name       : category,
        url        : xss(req.url),
        content    : paginated.posts,
        pagination : paginated.pagination,
      },
      wit : wit,
    });
  });

  callback();
};
