module.exports = function (wit, callback) {
  var posts = wit.posts;
  var tags  = {};

  // if the post has associated tags, register them
  for (var postName in posts) {
    var post = posts[postName];

    if (post.tags) {
      post.tags.forEach(function(tag) {
        if (!tags[tag]) {
          tags[tag] = {};
        }

        tags[tag][post.name] = post;
      });
    }
  }

  callback(null, tags);
};
