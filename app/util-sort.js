const lodash = require('lodash');

module.exports = function(posts) {

  // return newest posts first
  return lodash.sortBy(posts, function(post) {

    // NB / KLUDGE: sort() is now also invoked on page objects on page search,
    // and page objects don't typically have dates. Thus, the following
    // short-circuits on pages, converting the object to an array, but
    // performs no actual sorting.
    if (! post.date) { return 0; }

    // page objects are, however, sorted by date in descending order
    return (post.date.unix * -1);
  });
};
