const lodash = require('lodash');
const lunr   = require('lunr');

// initializes the lunr index
module.exports = function(configs, corpus) {

  // for convenience
  const boost = configs.search.boost;

  // construct and return a lunr index
  return lunr(function() {

    // create a handle on idx
    const that = this;

    // define the fields
    this.field('title'       , { boost: boost.title       });
    this.field('description' , { boost: boost.description });
    this.field('excerpt'     , { boost: boost.excerpt     });
    this.field('content'     , { boost: boost.content     });
    this.field('author'      , { boost: boost.author      });

    // index each item in the corpus
    lodash.forEach(corpus, function(item) {

      // exclude posts that are not `searchable`
      if (item.searchable === false) {
        return;
      }

      that.add({
        title       : item.title,
        description : item.description,
        excerpt     : item.excerpt,
        content     : item.content,
        author      : item.author,
        // XXX: risk of namespace conflicts between posts and pages?
        id          : item.name,
      });
    });

  });
};
