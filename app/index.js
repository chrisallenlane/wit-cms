const configsDefault = require('./boot-config');
const lodash         = require('lodash');
const search         = require('./boot-search');

// return an initializer function
module.exports = function(app, configsUser) {

  // apply user config overrides
  const configs = lodash.merge(configsDefault, configsUser);

  // initialize the wit object
  // bind params, and assemble pages and posts
  const wit = {
    params : configs.params || {},
    pages  : require('./boot-pages')(configs),
    posts  : require('./boot-posts')(configs),
  };

  // assemble the tags and categories
  wit.tags       = require('./boot-tags')      (wit.posts);
  wit.categories = require('./boot-categories')(wit.posts);

  // initialize the search indeces
  wit.index      = {
    page: search(configs, wit.pages),
    post: search(configs, wit.posts),
  };

  // user hook to allow content pre-processing
  if (typeof configs.build.before === 'function') {
    configs.build.before(configs, app, wit);
  }

  // define routes
  require('./routes-home')     (configs, app, wit);
  require('./routes-page')     (configs, app, wit);
  require('./routes-post')     (configs, app, wit);
  require('./routes-category') (configs, app, wit);
  require('./routes-tag')      (configs, app, wit);
  require('./routes-archive')  (configs, app, wit);
  require('./routes-feed')     (configs, app, wit);
  require('./routes-sitemap')  (configs, app, wit);
  require('./routes-search')   (configs, app, wit);
  require('./routes-async')    (configs, app, wit);

  // user hook to allow content post-processing
  if (typeof configs.build.after === 'function') {
    configs.build.after(configs, app, wit);
  }

  // return the wit object
  return wit;
};
