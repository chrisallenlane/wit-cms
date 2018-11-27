const archive   = require('../util/archive');
const config    = require('../boot/config');
const configs   = config();
const lodash    = require('lodash');
const paginate  = require('../util/paginate');
const search    = require('../util/search').search;
const sort      = require('../util/sort');
const asyncRoot = configs.path.asyncRoot;


// helper functions
// sends json
const send = function(res, response) {
  res.setHeader('content-type', 'application/json');
  res.send(response);
};

// "wrapped paginate"
const wpaginate = function(response, p) {
  return (p)
    ? paginate(response, { page : p, perPage : configs.posts.perPage })
    : { posts: sort(response) };
};

const notfound = function() {
  return { error: 'not found'};
};

module.exports = function(app, wit, callback) {

  // short-circuit if async routes are disabled
  if (! configs.enableAsyncRoutes) {
    return callback();
  }

  // returns the site configs
  app.get(asyncRoot + 'params', function(req, res) {
    send(res, { params: wit.params || {} });
  });

  // returns all pages
  app.get(asyncRoot + 'pages', function(req, res) {

    const response = (wit.pages)
      ? { pages: wit.pages }
      : notfound();

    send(res, response);
  });

  // search: returns pages matching query
  app.get(asyncRoot + 'pages/search', function(req, res) {

    const pages = search(req.query.q, 'pages');

    const response = (pages)
      ? wpaginate(pages, req.query.p)
      : notfound();

    // XXX: for this route only, return `pages` instead of `posts`
    response.pages = response.posts;
    delete response.posts;

    send(res, response);
  });

  // returns the specified page
  app.get(asyncRoot + 'pages/:title', function(req, res) {

    const response = (wit.pages[req.params.title])
      ? { page : wit.pages[req.params.title] }
      : notfound();

    send(res, response);
  });

  // returns all posts, optionally paginated
  app.get(asyncRoot + 'blog', function(req, res) {

    const response = (wit.posts)
      ? wpaginate(wit.posts, req.query.p)
      : notfound();

    send(res, response);
  });

  // returns a specific post
  app.get(asyncRoot + 'blog/post/:title', function(req, res) {
    
    const response = (wit.posts[req.params.title])
      ? { post : wit.posts[req.params.title] }
      : notfound();

    send(res, response);
  });
  
  // returns posts belonging to :category, optionally paginated
  app.get(asyncRoot + 'blog/category/:category', function(req, res) {

    const posts = lodash.filter(wit.posts, { categories: [ req.params.category ] });

    const response = (posts)
      ? wpaginate(posts, req.query.p)
      : notfound();

    send(res, response);
  });
  
  // returns posts belonging to :tag, optionally paginated
  app.get(asyncRoot + 'blog/tag/:tag', function(req, res) {

    const posts = lodash.filter(wit.posts, { tags: [ req.params.tag ] });

    const response = (posts)
      ? wpaginate(posts, req.query.p)
      : notfound();

    send(res, response);
  });

  // returns the specified archive
  app.get(asyncRoot + 'blog/archive/:year/:month?/:day?', function(req, res) {

    const posts = archive(wit.posts, {
      year  : req.params.year,
      month : req.params.month,
      day   : req.params.day,
    });

    const response = (! lodash.isEmpty(posts))
      ? wpaginate(posts, req.query.p)
      : notfound();

    send(res, response);
  });
  
  // search: returns blog posts matching query
  app.get(asyncRoot + 'blog/search', function(req, res) {

    const posts = search(req.query.q, 'posts');

    const response = (posts)
      ? wpaginate(posts, req.query.p)
      : notfound();

    send(res, response);
  });
  
  // return the categories
  app.get(asyncRoot + 'categories', function(req, res) {
    send(res, { categories: wit.categories || [] });
  });
  
  // return the tags
  app.get(asyncRoot + 'tags', function(req, res) {
    send(res, { tags: wit.tags || [] });
  });

  callback();
};
