const config     = require('./config');
var configs      = config();

const Remarkable = require('remarkable');
const fm         = require('json-front-matter');
const fs         = require('fs');
const moment     = require('moment');
const path       = require('path');
const remarkable = new Remarkable(configs.remarkable);
const truncatise = require('truncatise');

module.exports = function(wit, callback) {
  wit.posts   = {};
  
  // excerpt settings
  var truncateOptions = {
    TruncateLength : configs.posts.excerpt.length,
    TruncateBy     : configs.posts.excerpt.units,
    Strict         : false,
    StripHTML      : false,
    Suffix         : ''
  };

  // load the posts
  fs.readdir(configs.posts.dir, function(err, files) {

    // short-curcuit if posts are not found
    if (err && err.code === 'ENOENT') {
      console.warn(configs.posts.dir + 'does not exist. Skipping posts.');
      return callback(null, {});
    }
    
    // fail gracefully on other errors 
    if (err) { return callback(err); }

    // iterate over each file
    files.forEach(function(file) {
      // assemble the post object
      var post = {};
      
      // parse out the postname
      var extension = path.extname(file);
      post.name     = path.basename(file, extension);
      
      // ignore non-markdown files
      if (configs.markdownExtensions.indexOf(extension)) {
        // assemble what will be the post's URL
        post.url  = '/blog/post/' + post.name;

        // read the file
        post.raw = fs.readFileSync(configs.posts.dir + file, 'utf8');

        // parse out the post body
        var contents  = fm.parse(post.raw);
        post.markdown = contents.body;
        
        // parse out the front-matter
        for (var attr in contents.attributes) {
          post[attr] = contents.attributes[attr];
        }

        // format the date post
        if (post.date) {
          var m = moment(post.date, 'YYYY-MM-DD');
          post.date = {
            datetime : m.format(),
            day      : m.format('DD'),
            month    : m.format('MM'),
            pretty   : m.format(configs.dateFormat),
            unix     : m.format('X'),
            year     : m.format('YYYY'),
          };
        }

        // render the markdown
        post.content = remarkable.render(post.markdown);

        // Search for the "Read More" separator among the post content. If it's
        // there, split the excerpt there. Otherwise, default to chopping at the
        // configured point.
        var readMorePos = post.content.indexOf(configs.readMoreSeparator);
        if (readMorePos > 0) {
          post.excerpt = post.content.substr(0, readMorePos);
        } else {
          post.excerpt = truncatise(post.content, truncateOptions);
        }
        
        // free some memory
        delete post.markdown;
        delete post.raw;

        // buffer the post
        wit.posts[post.name] = post;
      }
    });

    callback();
  });
};
