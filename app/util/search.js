const config = require('../boot/config');
const lodash = require('lodash');
const lunr   = require('lunr');

var configs = config();
var boost   = configs.search.boost;

// lunr search index
var idx = lunr(function() {
  this.field('title'       , { boost: boost.title       });
  this.field('description' , { boost: boost.description });
  this.field('excerpt'     , { boost: boost.excerpt     });
  this.field('content'     , { boost: boost.content     });
  this.field('author'      , { boost: boost.author      });
});

// initializes the lunr index
module.exports.initialize = function(wit) {

  // add the posts to the index
  lodash.forEach(wit.posts, function(post) {
    idx.add({
      title       : post.title,
      description : post.description,
      excerpt     : post.excerpt,
      content     : post.content,
      author      : post.author,
      id          : post.name,
    });
  });
};

// returns search results
module.exports.search = function(posts, query) {
  return idx.search(query).map(function(match) {
    return posts[match.ref];
  });
};
