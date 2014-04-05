module.exports = function(wit, callback) {
  var app        = wit.app;
  var categories = wit.categories;

  // category index page
  app.get('/blog/category/:category', function(req, res) {
    var posts    = [];
    var category = req.params.category;

    for (var postName in categories[category]) {
      posts.push(categories[category][postName]);
    }

    // sort the posts by date
    posts        = wit.sort(posts);
    var nextPrev = wit.nextPrev(posts, req.query.p);
    posts        = wit.paginate(posts, req.query.p);

    res.render('category', {
      bodyClass : 'category',
      nextPrev  : nextPrev,
      posts     : posts,
      category  : category,
      title     : category,
    });
  });

  // specific category post
  app.get('/blog/category/:category/:post', function(req, res) {
    res.render('post', {
      bodyClass    : 'category ' + category + ' ' + post.name,
      canonicalUrl : post.url,
      description  : post.description,
      post         : category[req.params.category][req.params.post],
      category     : req.params.category,
      title        : req.params.category,
    });
  });

  callback(null, null);
};
