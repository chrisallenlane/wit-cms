module.exports = function (wit, callback) {
  var moment   = require('moment');
  var app      = wit.app;
  var posts    = wit.posts;
  var rssPosts = [];

  Object.keys(posts).forEach(function(post) {
    rssPosts.push(posts[post]);
  });

  rssPosts = wit.sort(rssPosts);
  rssPosts = wit.paginate(rssPosts, 1);

  app.get('/feed', function(req, res) {
    res.set('content-type', 'application/xml');
    res.render('feed', {
      posts   : rssPosts,
      pubDate : moment().format(),
    });
  });

  callback(null, null);
};
