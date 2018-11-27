const config  = require('../boot/config');
const configs = config();
const lodash  = require('lodash');
const lunr    = require('lunr');
const boost   = configs.search.boost;

// lunr post index
const postIndex = lunr(function() {
  this.field('title'       , { boost: boost.title       });
  this.field('description' , { boost: boost.description });
  this.field('excerpt'     , { boost: boost.excerpt     });
  this.field('content'     , { boost: boost.content     });
  this.field('author'      , { boost: boost.author      });
});

// lunr page index
const pageIndex = lunr(function() {
  this.field('title'       , { boost: boost.title       });
  this.field('description' , { boost: boost.description });
  this.field('content'     , { boost: boost.content     });
});

var pages;
var posts;

// initializes the lunr index
module.exports.initialize = function(wit) {

  // buffer the search corpuses
  pages = wit.pages;
  posts = wit.posts;

  // add the posts to the post index
  lodash.forEach(posts, function(post) {
    postIndex.add({
      title       : post.title,
      description : post.description,
      excerpt     : post.excerpt,
      content     : post.content,
      author      : post.author,
      id          : post.name,
    });
  });

  // add the pages to the page index
  lodash.forEach(pages, function(page) {
    pageIndex.add({
      title       : page.title,
      description : page.description,
      content     : page.content,
      id          : page.name,
    });
  });
};

// returns search results
module.exports.search = function(needle, haystack) {

  // select the appropriate search index and corpus
  const idx    = (haystack === 'pages') ? pageIndex : postIndex ;
  const corpus = (haystack === 'pages') ? pages     : posts ;

  return idx.search(needle).map(function(match) {
    return corpus[match.ref];
  });
};
