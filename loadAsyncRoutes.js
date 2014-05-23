module.exports = function(wit, callback) {
  var app       = wit.app;
  var asyncRoot = wit.config.asyncRoot;
  
  // returns the site configs
  app.get(asyncRoot + 'config', function(req, res) {
    return res.send(wit.config.site);
  });

  // returns the specified page, or all pages
  app.get(asyncRoot + 'pages/:title?', function(req, res) {
    return res.send(
      (req.param('title'))
      ? wit.pages[req.param('title')]
      : wit.pages
    );
  });

  // returns the specified post, or all posts
  app.get(asyncRoot + 'posts/:title?', function(req, res) {
    return res.send(
      (req.param('title'))
      ? wit.posts[req.param('title')]
      : wit.posts
    );
  });
  
  // returns the specified tag, or all tags
  app.get(asyncRoot + 'tags/:tag?', function(req, res) {
    return res.send(
      (req.param('tag'))
      ? wit.tags[req.param('tag')]
      : wit.tags
    );
  });
  
  // returns the specified category, or all categories
  app.get(asyncRoot + 'categories/:category?', function(req, res) {
    return res.send(
      (req.param('category'))
      ? wit.categories[req.param('category')]
      : wit.categories
    );
  });
  
  // returns the specified archive
  app.get(asyncRoot + 'archive/:year?/:month?/:day?', function(req, res) {
    var archive = wit.archive;

    if (req.param('year')) {
      archive = archive[req.param('year')];
    }
    if (req.param('month')) {
      archive = archive[req.param('month')];
    }
    if (req.param('day')) {
      archive = archive[req.param('day')];
    }
    return res.send(archive);
  });

  callback(null, null);
};
