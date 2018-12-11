const lodash = require('lodash');

module.exports = function (posts) {

  const tags = [];

  // iterate over each post
  lodash.forEach(posts, function (post) {

    // iterate over each tag per post
    post.tags.forEach(function(tag) {
      tags.push(tag);
    });
  });

  // de-duplicate, sort, and return the tags
  return lodash.uniq(tags).sort();
};
