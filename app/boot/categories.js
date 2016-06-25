const lodash = require('lodash');

module.exports = function (wit, callback) {
  wit.categories = [];

  // push each post's categories to wit.categories
  lodash.forEach(wit.posts, function(post) {
    post.categories.forEach(function(category) {
      wit.categories.push(category);
    });
  });

  // de-duplicate and sort wit.categories
  wit.categories = lodash.uniq(wit.categories).sort();

  callback();
};
