const archive  = require('../util/archive');
const config   = require('../boot/config');
const lodash   = require('lodash');
const paginate = require('../util/paginate');
const xss      = require('xss');
var configs    = config();

module.exports = function (app, wit, callback) {

  // archive by day
  app.get('/blog/archive/:year/:month?/:day?', function(req, res) {

    // sanitize the inputs (they will be fed into the response markup)
    var year  = xss(req.params.year);
    var month = xss(req.params.month);
    var day   = xss(req.params.day);

    // find the appropriate posts
    var posts = archive(wit.posts, {
      year  : year,
      month : month,
      day   : day,
    });
    
    // paginate the posts
    var paginated = paginate(posts, {
      page    : req.query.p,
      perPage : configs.posts.perPage,
    });

    res.render('archive', {
      page : {
        title      : 'archive',
        name       : 'archive',
        url        : xss(req.url),
        content    : paginated.posts,
        pagination : paginated.pagination,
        date       : {
          year  : year  || '',
          month : month || '',
          day   : day   || '',
        },
      },
      wit : wit,
    });
  });

  callback();
};
