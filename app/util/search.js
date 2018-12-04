const config = require('../boot/config');
const lodash = require('lodash');
const lunr   = require('lunr');
const boost  = config().search.boost;

var postIndex;
var pageIndex;

var pages;
var posts;

// initializes the lunr index
module.exports.initialize = function(wit) {

  // buffer the search corpuses
  pages = wit.pages;
  posts = wit.posts;

  // lunr post index
  postIndex = lunr(function() {
    const that = this;

    // define the fields
    this.field('title'       , { boost: boost.title       });
    this.field('description' , { boost: boost.description });
    this.field('excerpt'     , { boost: boost.excerpt     });
    this.field('content'     , { boost: boost.content     });
    this.field('author'      , { boost: boost.author      });

    // add the posts to the post index
    lodash.forEach(posts, function(post) {
      that.add({
        title       : post.title,
        description : post.description,
        excerpt     : post.excerpt,
        content     : post.content,
        author      : post.author,
        id          : post.name,
      });
    });

  });


  // lunr page index
  pageIndex = lunr(function() {
    const that = this;

    // define the fields
    this.field('title'       , { boost: boost.title       });
    this.field('description' , { boost: boost.description });
    this.field('content'     , { boost: boost.content     });

    // add the pages to the page index
    lodash.forEach(pages, function(page) {
      that.add({
        title       : page.title,
        description : page.description,
        content     : page.content,
        id          : page.name,
      });
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
