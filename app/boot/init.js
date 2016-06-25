const config     = require('./config');
const fm         = require('json-front-matter');
const fs         = require('fs');
const Remarkable = require('remarkable');
const moment     = require('moment');
const path       = require('path');
const truncatise = require('truncatise');
const remarkable = new Remarkable({ html: true });
var configs      = config();

module.exports = function(app, wit, callback) {

  // short-circuit if an  `init` function was not passed
  if (typeof configs.init !== 'function' ) {
    return callback();
  }

  // otherwise, run the init function
  configs.init(app, wit, callback);
};
