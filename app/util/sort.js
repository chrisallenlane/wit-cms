const lodash = require('lodash');

module.exports = function(posts) {

  // return newest posts first
  return lodash.sortBy(posts, function(post) {
    return (post.date.unix * -1);
  });
};
