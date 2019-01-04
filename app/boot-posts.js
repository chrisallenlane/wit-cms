const Remarkable = require('remarkable');
const fm         = require('json-front-matter');
const fs         = require('fs');
const moment     = require('moment');
const path       = require('path');
const truncatise = require('truncatise');

module.exports = function(configs) {

  // vars
  var posts = {};
  var files = [];

  // initialize the markdown parser
  const remarkable = new Remarkable(configs.build.markdown.remarkable);
  
  // excerpt settings
  const truncateOptions = {
    TruncateLength : configs.posts.excerpt.length,
    TruncateBy     : configs.posts.excerpt.units,
    Strict         : false,
    StripHTML      : false,
    Suffix         : ''
  };

  // read the directory containing post files
  try {
    files = fs.readdirSync(configs.posts.dir);
  } catch (err) {

    // short-curcuit if posts are not found
    if (err && err.code === 'ENOENT') {
      console.warn(configs.posts.dir + ' does not exist. Skipping posts.');
      return {};
    }
    
    // throw other errors
    else { throw err; }
  }

  // iterate over each file
  files.forEach(function(file) {

    // assemble the post object
    const post = {};
    
    // parse out the postname
    const extension = path.extname(file);
    post.name       = path.basename(file, extension);
    
    // ignore non-markdown files
    if (configs.build.markdown.extensions.indexOf(extension)) {

      // assemble what will be the post's URL
      post.url  = '/blog/post/' + post.name;

      // read the file
      post.raw = fs.readFileSync(configs.posts.dir + file, 'utf8');

      // parse out the post body
      const contents = fm.parse(post.raw);
      post.markdown  = contents.body;
      
      // parse out the front-matter
      for (const attr in contents.attributes) {
        post[attr] = contents.attributes[attr];
      }

      // format the date post
      if (post.date) {
        const m   = moment(post.date, 'YYYY-MM-DD');
        post.date = {
          datetime : m.format(),
          day      : m.format('DD'),
          month    : m.format('MM'),
          pretty   : m.format(configs.posts.dateFormat),
          unix     : m.format('X'),
          year     : m.format('YYYY'),
        };
      }

      // render the markdown
      post.content = remarkable.render(post.markdown);

      // Search for the "Read More" separator among the post content. If it's
      // there, split the excerpt there. Otherwise, default to chopping at the
      // configured point.
      const readMorePos = post.content.indexOf(configs.posts.readMoreSeparator);
      if (readMorePos > 0) {
        post.excerpt = post.content.substr(0, readMorePos);
      } else {
        post.excerpt = truncatise(post.content, truncateOptions);
      }
      
      // free some memory
      delete post.markdown;
      delete post.raw;

      // buffer the post
      posts[post.name] = post;
    }
  });

  // return the post objects
  return posts;
};
