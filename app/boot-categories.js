const lodash = require('lodash');

module.exports = function (posts) {

  const categories = [];

  // iterate over each post
  lodash.forEach(posts, function (post) {

    // iterate over each category per post
    post.categories.forEach(function(category) {
      categories.push(category);
    });
  });

  // de-duplicate, sort, and return the categories
  return lodash.uniq(categories).sort();
};
