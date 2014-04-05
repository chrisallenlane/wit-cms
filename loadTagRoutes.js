module.exports = function(wit, callback) {
  var app  = wit.app;
  var tags = wit.tags;

  // tag index page
  app.get('/blog/tag/:tag', function(req, res) {
    var posts = [];
    var tag   = req.params.tag;

    for (var postName in tags[tag]) {
      posts.push(tags[tag][postName]);
    }

    // sort the posts by date
    posts        = wit.sort(posts);
    var nextPrev = wit.nextPrev(posts, req.query.p);
    posts        = wit.paginate(posts, req.query.p);

    res.render('tag', {
      bodyClass : 'tag',
      nextPrev  : nextPrev,
      posts     : posts,
      tag       : tag,
      title     : tag,
    });
  });

  // specific tag post
  app.get('/blog/tag/:tag/:post', function(req, res) {
    res.render('post', {
      bodyClass    : 'tag ' + tag + ' ' + post.name,
      canonicalUrl : post.url,
      description  : post.description,
      post         : tags[req.params.tag][req.params.post],
      tag          : req.params.tag,
      title        : req.params.tag,
    });
  });

  callback(null, null);
};
