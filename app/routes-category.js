const lodash   = require('lodash');
const paginate = require('./util-paginate');
const sort     = require('./util-sort');
const xss      = require('xss');

module.exports = function(configs, app, wit) {

  // category index page
  app.get('/blog/category/:category', function(req, res) {

    // sanitize the input (it will be fed into the response markup)
    const category = xss(req.params.category);

    // find the appropriate posts
    const posts    = sort(lodash.filter(wit.posts, { categories: [ category ] }));

    // paginate the posts
    const paginated = paginate(posts, {
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

};
