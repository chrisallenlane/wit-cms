const config  = require('./config');
const configs = config();

module.exports = function(app, wit, callback) {

  // short-circuit if an  `init` function was not passed
  if (typeof configs.init !== 'function' ) {
    return callback();
  }

  // otherwise, run the init function
  configs.init(app, wit, callback);
};
