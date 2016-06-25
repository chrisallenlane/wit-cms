const async  = require('async');
const config = require('./app/boot/config');
const search = require('./app/util/search');

// return an initializer function
module.exports = function(app, configs, callback) {

  // initialize the wit object
  var wit = {};

  // set the configs
  config(configs);

  // bind `params` to wit
  wit.params = config().params || {};

  // bootstrap the app
  async.series([
    function (cb) { require('./app/boot/pages')      (wit, cb);      },
    function (cb) { require('./app/boot/posts')      (wit, cb);      },
    function (cb) { require('./app/boot/categories') (wit, cb);      },
    function (cb) { require('./app/boot/tags')       (wit, cb);      },
    function (cb) { require('./app/routes/page')     (app, wit, cb); },
    function (cb) { require('./app/routes/post')     (app, wit, cb); },
    function (cb) { require('./app/routes/category') (app, wit, cb); },
    function (cb) { require('./app/routes/tag')      (app, wit, cb); },
    function (cb) { require('./app/routes/archive')  (app, wit, cb); },
    function (cb) { require('./app/routes/search')   (app, wit, cb); },
    function (cb) { require('./app/routes/feed')     (app, wit, cb); },
    function (cb) { require('./app/routes/sitemap')  (app, wit, cb); },
    function (cb) { require('./app/routes/async')    (app, wit, cb); },
    function (cb) { require('./app/boot/init')       (app, wit, cb); },
  ], function(err) {

    // initialize the search index
    search.initialize(wit);

    // bootsrapping complete
    callback(err, wit);
  });
};
