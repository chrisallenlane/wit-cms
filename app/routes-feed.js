const moment   = require('moment');
const paginate = require('./util-paginate');

module.exports = function (configs, app, wit) {

  app.get(['/feed', '/feed.xml'], function(req, res) {

    const paginated = paginate(wit.posts, {
      page    : req.query.p,
      perPage : configs.posts.perPage,
    });

    res.set('content-type', 'application/xml');

    res.render('feed', {
      page : {
        date    : { pubDate: moment().format() },
        content : paginated.posts,
      },
      wit : wit,
    });
  });

};
