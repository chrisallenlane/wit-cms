// helper function that performs searches
module.exports = function (needle, haystack, index) {
  return index.search(needle).map(function(match) {
    return haystack[match.ref];
  });
};
