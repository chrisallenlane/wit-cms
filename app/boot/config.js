const lodash = require('lodash');

// set the default configs
var configs = {

  path: {
    // path at which data may be retrieved asynchronously
    asyncRoot: '/async/',

    // 404 page
    notFoundPage: '/not-found',
  },
  
  // page configs
  pages: {
    dir: './pages/',
  },

  // post configs
  posts: {
    dir      : './posts/',
    excerpt  : {
      length : 1,
      units  : 'paragraphs',
    },
    perPage  : 5,
  },

  // search configs
  search: {
    boost: {
      title       : 10,
      description : 5,
      excerpt     : 5,
      content     : 0,
      author      : 0,
    },
  },

  // misc configs
  dateFormat         : 'D MMMM YYYY',
  readMoreSeparator  : '<!--more-->',
  markdownExtensions : [ 'markdown', 'md' ],
  enableAsyncRoutes  : true,
};

var get = function() {
  return configs;
};

var set = function(params) {
  return lodash.merge(configs, params);
};

// set() if params were provided. Otherwise, get().
module.exports = function(params) {
  return (params)
    ? set(params)
    : get() ;
};
