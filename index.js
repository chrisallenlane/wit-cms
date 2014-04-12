// return an initializer function
module.exports.init = function(app, configs, callback) {
  var async = require('async');

  // specify default configs
  var wit = {
    app    : app,
    config : {
      
      // page configs
      pages: {
        dir: configs.pages.dir || './pages/',
      },

      // post configs
      posts: {
        dir      : configs.posts.dir            || './posts/',
        excerpt  : {
          length : configs.posts.excerpt.length || 1,
          units  : configs.posts.excerpt.units  || 'paragraphs',
        },
        perPage  : configs.posts.perPage        || 5,
      },

      // misc configs
      dateFormat        : configs.dateFormat        || 'YYYY-MM-DD',
      readMoreSeparator : configs.readMoreSeparator || '<!--more-->',
    },
  };

  // accept arbitrary parameters through configs.site
  wit.config.site = configs.site;

  // sorts posts in descending chronological order
  wit.sort = function (posts) {
  return posts.sort(function(a, b) {
    if (a.date.unix < b.date.unix) { return 1; }
    if (a.date.unix > b.date.unix) { return -1; }
    // @todo: alphabetical sub-sort
    return 0;
    });
  };

  // pagination helper function
  wit.paginate = function(posts, page) {
    page      = Number(page);
    page      = (page >= 1) ? (page - 1) : 0;
    var start = page * wit.config.posts.perPage;
    var end   = start + wit.config.posts.perPage;
    end       = (end < posts.length) ? end : posts.length ;
    return posts.slice(start, end);
  };

  // generates "next/previous" navigation
  // @kludge: I must have solved this the most convoluted way possible...
  wit.nextPrev = function (posts, page) {
    page         = Number(page);
    page         = (page >= 1) ? (page - 1) : 0;
    var count    = Math.ceil(posts.length / wit.config.posts.perPage);
    var lastPage = count - 1;
    var previous = (page <= 0) ? 0 : (page - 1) ;
    var next     = ((page + 1) <= lastPage) ? (page + 1) : lastPage ;
    return {
      current  : page,
      previous : (page === 0) ? false : (previous + 1) ,
      count    : count,
      next     : (page === lastPage) ? false : (next + 1),
    };
  };

  // methods to bootstrap the app
  var loadArchive        = require('./loadArchive');
  var loadArchiveRoutes  = require('./loadArchiveRoutes');
  var loadCategories     = require('./loadCategories');
  var loadCategoryRoutes = require('./loadCategoryRoutes');
  var loadFeedRoute      = require('./loadFeedRoute');
  var loadPageRoutes     = require('./loadPageRoutes');
  var loadPages          = require('./loadPages');
  var loadPostRoutes     = require('./loadPostRoutes');
  var loadPosts          = require('./loadPosts');
  var loadSitemapRoute   = require('./loadSitemapRoute');
  var loadTagRoutes      = require('./loadTagRoutes');
  var loadTags           = require('./loadTags');

  // bootstrap the app
  async.series(
    [
      //load the pages
      function (callback) {
        loadPages(wit, function(err, pages) {
          wit.pages = pages;
          callback(err, true);
        });
      },

      // load the posts
      function (callback) {
        loadPosts(wit, function(err, posts) {
          wit.posts = posts;
          callback(err, true);
        });
      },
      
      // load the categories
      function (callback) {
        loadCategories(wit, function(err, categories) {
          wit.categories = categories;
          callback(err, true);
        });
      },

      // load the tags
      function (callback) {
        loadTags(wit, function(err, tags) {
          wit.tags     = tags;
          callback(err, true);
        });
      },
      
      // load the archive
      function (callback) {
        loadArchive(wit, function(err, archive) {
          wit.archive = archive;
          callback(err, true);
        });
      },
      
      // create the page routes
      function (callback) {
        loadPageRoutes(wit, function(err) {
          callback(err, true);
        });
      },
      
      // create the post routes
      function (callback) {
        loadPostRoutes(wit, function(err) {
          callback(err, true);
        });
      },
      
      // create the category routes
      function (callback) {
        loadCategoryRoutes(wit, function(err) {
          callback(err, true);
        });
      },

      
      // create the tag routes
      function (callback) {
        loadTagRoutes(wit, function(err) {
          callback(err, true);
        });
      },

      // create the archive routes
      function (callback) {
        loadArchiveRoutes(wit, function(err) {
          callback(err, true);
        });
      },
      
      // create the feed
      function (callback) {
        loadFeedRoute(wit, function(err) {
          callback(err, true);
        });
      },

      // create the sitemap
      function (callback) {
        loadSitemapRoute(wit, function(err) {
          callback(err, true);
        });
      },
    ],

    // done
    function(err, results) {
      // expose the wit object to the templates
      wit.app.locals({ wit : wit });
      callback(err, wit);
    }
  );
};
