const config   = require('../boot/config');
const configs  = config();
const lodash   = require('lodash');
const paginate = require('../util/paginate');
const sort     = require('../util/sort');
const xss      = require('xss');

module.exports = function(app, wit, callback) {

  // tag index page
  app.get('/blog/tag/:tag', function(req, res) {

    // sanitize the input (it will be fed into the response markup)
    const tag   = xss(req.params.tag);

    // find the appropriate posts
    const posts = sort(lodash.filter(wit.posts, { tags: [ tag ] }));

    // paginate the posts
    const paginated = paginate(posts, {
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
