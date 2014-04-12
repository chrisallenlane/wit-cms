module.exports = function(wit, callback) {
  var fm     = require('json-front-matter');
  var fs     = require('fs');
  var marked = require('marked');
  var path   = require('path');
  var config = wit.config;
  var pages  = {};

  //fs.readdir(this.config.pagesDir, function(err, files) {
  fs.readdir(config.pages.dir, function(err, files) {
    // iterate over each file
    files.forEach(function(file) {
      // assemble the page object
      var page = {};
      
      // parse out the page name
      // @todo: support the .markdown extension
      var extension = path.extname(file);
      page.name     = path.basename(file, extension);
      
      // ignore non-markdown files
      if (extension === '.md') {
        // assemble what will be the pages's URL
        page.url  = '/' + page.name;

        // read the file
        page.raw = fs.readFileSync(config.pages.dir + file, 'utf8');

        // parse out the page body
        var contents  = fm.parse(page.raw);
        page.markdown = contents.body;
        
        // parse out the front-matter
        for (var attr in contents.attributes) {
          page[attr] = contents.attributes[attr];
        }

        // render the markdown
        page.content = marked(page.markdown);
        
        // free some memory
        delete page.markdown;
        delete page.raw;

        // buffer the page
        pages[page.name] = page;
      }
    });

    callback(err, pages);
  });
};
