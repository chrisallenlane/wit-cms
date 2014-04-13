module.exports = function(wit, callback) {
  var fm         = require('json-front-matter');
  var fs         = require('fs');
  var marked     = require('marked');
  var moment     = require('moment');
  var path       = require('path');
  var truncatise = require('truncatise');
  var config     = wit.config;
  var posts      = {};
  
  // excerpt settings
  var truncateOptions = {
    TruncateLength : config.posts.excerpt.length,
    TruncateBy     : config.posts.excerpt.units,
    Strict         : false,
    StripHTML      : false,
    Suffix         : ''
  };

  // load the posts
  fs.readdir(config.posts.dir, function(err, files) {

    // fail gracefully if posts are not present
    if (err && err.code === 'ENOENT') {
      console.warn(config.posts.dir + 'does not exist. Skipping posts.');
      return callback(null, {});
    }

    // iterate over each file
    files.forEach(function(file) {
      // assemble the post object
      var post = {};
      
      // parse out the postname
      var extension = path.extname(file);
      post.name     = path.basename(file, extension);
      
      // ignore non-markdown files
      if (['markdown', '.md'].indexOf(extension)) {
        // assemble what will be the post's URL
        post.url  = '/blog/post/' + post.name;

        // read the file
        post.raw = fs.readFileSync(config.posts.dir + file, 'utf8');

        // parse out the post body
        var contents  = fm.parse(post.raw);
        post.markdown = contents.body;
        
        // parse out the front-matter
        for (var attr in contents.attributes) {
          post[attr] = contents.attributes[attr];
        }

        // format the date post
        if (post.date) {
          var m = moment(post.date, config.dateFormat);
          post.date = {
            datetime : m.format(),
            day      : m.format('DD'),
            month    : m.format('MM'),
            // @todo: this should be configurable 
            pretty   : m.format('D MMMM YYYY'),
            unix     : m.format('X'),
            year     : m.format('YYYY'),
          };
        }

        // render the markdown
        post.content = marked(post.markdown);

        // Search for the "Read More" separator among the post content. If it's
        // there, split the excerpt there. Otherwise, default to chopping at the
        // configured point.
        var readMorePos = post.content.indexOf(config.readMoreSeparator);
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

    callback(err, posts);
  });
};
