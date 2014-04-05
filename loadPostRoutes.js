module.exports = function(wit, callback) {
  var app   = wit.app;
  var posts = wit.posts;

  // blog index page
  app.get('/blog', function(req, res) {
    var blogPosts = [];
    for (var postName in posts) {
      blogPosts.push(posts[postName]);
    }
    blogPosts    = wit.sort(blogPosts);
    var nextPrev = wit.nextPrev(blogPosts, req.query.p);
    blogPosts    = wit.paginate(blogPosts, req.query.p);

    res.render( 'blog', {
      bodyClass : 'blog',
      nextPrev  : nextPrev,
      posts     : blogPosts,
      title     : 'Blog',
    });
  });

  // blog post
  app.get('/blog/post/:name', function(req, res) {
    var post = posts[req.params.name];

    // if the post is invalid, issue a 404
    if (!post) { 
      res.render( '404', {
        bodyClass : 'post error error-404',
        post         : {},
        title        : 'Not Found',
      });
    }

    // otherwise, render the appropriate post
    res.render( post.view || 'post', {
      bodyClass : 'post ' + post.name,
      canonicalUrl : post.url,
      description  : post.description,
      post         : post,
      title        : post.title || '',
    });
  });

  callback(null, null);
};
