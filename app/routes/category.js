const config   = require('../boot/config');
const lodash   = require('lodash');
const paginate = require('../util/paginate');
const xss      = require('xss');

module.exports = function(app, wit, callback) {

  // category index page
  app.get('/blog/category/:category', function(req, res) {

    // sanitize the input (it will be fed into the response markup)
    const category = xss(req.params.category);

    // find the appropriate posts
    const posts    = lodash.filter(wit.posts, { categories: [ category ] });

    // paginate the posts
    const paginated = paginate(posts, {
      page    : req.query.p,
      perPage : config().posts.perPage,
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
