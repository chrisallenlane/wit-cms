const archive  = require('./util-archive');
const paginate = require('./util-paginate');
const sort     = require('./util-sort');
const xss      = require('xss');

module.exports = function (configs, app, wit) {

  // archive by day
  app.get('/blog/archive/:year/:month?/:day?', function(req, res) {

    // sanitize the inputs (they will be fed into the response markup)
    const year  = xss(req.params.year);
    const month = xss(req.params.month);
    const day   = xss(req.params.day);

    // find the appropriate posts
    const posts = sort(archive(wit.posts, {
      year  : year,
      month : month,
      day   : day,
    }));
    
    // paginate the posts
    const paginated = paginate(posts, {
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

};
