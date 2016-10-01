const config   = require('../boot/config');
const lodash   = require('lodash');
const paginate = require('../util/paginate');
const xss      = require('xss');
var configs    = config();

module.exports = function(app, wit, callback) {

  // tag index page
  app.get('/blog/tag/:tag', function(req, res) {

    // sanitize the input (it will be fed into the response markup)
    var tag   = xss(req.params.tag);

    // find the appropriate posts
    var posts = lodash.filter(wit.posts, { tags: [ tag ]});

    // paginate the posts
    var paginated = paginate(posts, {
      page    : req.query.p,
      perPage : configs.posts.perPage,
    });

    res.render('tag', {
      page : {
        title      : 'tag',
        name       : tag,
        url        : xss(req.url),
        content    : paginated.posts,
        pagination : paginated.pagination,
      },
      wit : wit,
    });
  });

  callback();
};
