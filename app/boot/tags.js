const lodash = require('lodash');

module.exports = function (wit, callback) {
  wit.tags = [];

  // push each post's tags to wit.tags
  lodash.forEach(wit.posts, function(post) {
    post.tags.forEach(function(tag) {
      wit.tags.push(tag);
    });
  });

  // de-duplicate and sort wit.tags
  wit.tags = lodash.uniq(wit.tags).sort();

  callback();
};
