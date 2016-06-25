const config   = require('../boot/config');
const moment   = require('moment');
const paginate = require('../util/paginate');
var configs    = config();

module.exports = function (app, wit, callback) {

  app.get('/feed', function(req, res) {

    var paginated = paginate(wit.posts, {
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

  callback();
};
