const lodash = require('lodash');

module.exports = function (wit, callback) {
  wit.tags = [];

  // push each post's tags to wit.tags
  lodash.forEach(wit.posts, function(post) {
    post.tags.forEach(function(tag) {
      //Title case all tags
      wit.tags.push(lodash.startCase(lodash.toLower(tag)))
    });
  });

  // de-duplicate and sort wit.tags
  wit.tags = lodash.uniq(wit.tags).sort();

  callback();
};
