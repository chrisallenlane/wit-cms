module.exports = function (wit, callback) {
  var posts      = wit.posts;
  var categories = {};

  // if the post has associated categories, register them
  for (var postName in posts) {
    var post = posts[postName];

    if (post.categories) {
      post.categories.forEach(function(category) {
        if (!categories[category]) {
          categories[category] = {};
        }

        categories[category][post.name] = post;
      });
    }
  }

  callback(null, categories);
};
