const lodash = require('lodash');
const pad    = require('left-pad');

module.exports = function(posts, params) {

  const date = {};

  if (params.year) {
    date.year = String(params.year);
  }

  if (params.month) {
    date.month = pad(params.month, 2, 0);
  }

  if (params.day) {
    date.day = pad(params.day, 2, 0);
  }

  return lodash.filter(posts, { date: date });
};
