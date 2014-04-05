module.exports = function (wit, callback) {
  var archive = {};
  var posts   = wit.posts;

  // add the post to the archives
  for (var postName in posts) {
    var post = posts[postName];

    if (!archive[post.date.year]) {
      archive[post.date.year] = {};
    }
    if (!archive[post.date.year][post.date.month]) {
      archive[post.date.year][post.date.month] = {};
    }
    if (!archive[post.date.year][post.date.month][post.date.day]) {
      archive[post.date.year][post.date.month][post.date.day] = {};
    }
    archive[post.date.year][post.date.month][post.date.day][post.name] = post;
  }

  callback(null, archive);
};
