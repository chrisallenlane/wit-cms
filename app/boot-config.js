const hljs = require('highlight.js');

// set the default configs
module.exports = {

  // markdown configs
  markdown: {
    extensions: [ 'markdown', 'md' ], // markdown file extensions

    // remarkable (markdown parser) configs
    remarkable: {
      html    : true,                 // allow html tags in source
      linkify : true,                 // auto-link urls?

      // implement code syntax-highlighting via highlightjs
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (err) {}
        }
        try {
          return hljs.highlightAuto(str).value;
        } catch (err) {}
        return '';
      }
    },
  },

  // async routes
  async: {
    enabled : true,                    // enable async routes?
    root    : '/async/',               // prefix at which async routes are available
  },

  // build hooks
  build: {
    /*
    // function to invoke before initializing the wit object
    before: function (configs, app, wit) {

    },

    // function to invoke after the wit object has been initialized
    after: function (configs, app, wit) {

    },
    */
  },
  
  // page configs
  pages: {
    dir      : './pages/',             // directory in which markdown page files are located
    notFound : '/not-found',           // 404 "not found" page url
    home     : '/blog',                // TODO
  },

  // post configs
  posts: {
    dir      : './posts/',              // directory in which markdown page files are located
    excerpt  : {                        // rules for generating excerpts
      length : 1,
      units  : 'paragraphs',
    },
    perPage  : 5,                       // number of posts to display on the blog index page
    readMoreSeparator : '<!--more-->',  // separator between excerpt and remaining content
    dateFormat        : 'D MMMM YYYY',  // article date format
  },

  // search configs
  search: {                             // lunrjs search configs
    boost: {                            // ranking weights per post property
      title       : 10,
      description : 5,
      excerpt     : 5,
      content     : 0,
      author      : 0,
    },
  },

};
