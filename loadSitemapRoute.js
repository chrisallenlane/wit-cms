module.exports = function(wit, callback) {
  var moment = require('moment');
  var app    = wit.app;
  var pages  = wit.pages;
  var posts  = wit.posts;
  var urlSet = [];

  Object.keys(pages).forEach(function(page) {
    urlSet.push(pages[page]);
  });
  Object.keys(posts).forEach(function(post) {
    urlSet.push(posts[post]);
  });

  app.get('/sitemap.xml', function(req, res) {
    res.set('content-type', 'application/xml');
    res.render('sitemap', {
      urlSet  : urlSet,
      pubDate : moment().format(),
    });
  });

  callback(null, null);
};
