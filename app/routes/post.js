const config   = require('../boot/config');
const paginate = require('../util/paginate');
const xss      = require('xss');

module.exports = function(app, wit, callback) {

  // blog index page
  app.get('/blog', function(req, res) {

    // paginate the posts
    const paginated = paginate(wit.posts, {
      page    : req.query.p,
      perPage : config().posts.perPage,
    });

    res.render('blog', {
      page : {
        title      : 'blog',
        name       : 'blog',
        url        : xss(req.url),
        content    : paginated.posts,
        pagination : paginated.pagination,
      },
      wit : wit,
    });
  });

  // blog post
  app.get('/blog/post/:name', function(req, res) {
    const post = wit.posts[req.params.name];

    if (! post) {
      return res.redirect(config().path.notFoundPage);
    }

    // otherwise, render the appropriate post
    res.render(post.view || 'post', {
      // NB: `page` is aliased as `post` as sugar
      page : post,
      post : post,
      wit  : wit,
    });
  });

  callback();
};
