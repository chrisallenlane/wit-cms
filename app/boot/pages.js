const config     = require('./config');
const fm         = require('json-front-matter');
const fs         = require('fs');
const Remarkable = require('remarkable');
const path       = require('path');
const remarkable = new Remarkable({ html: true });

module.exports = function(wit, callback) {
  var configs = config();
  wit.pages   = {};

  fs.readdir(configs.pages.dir, function(err, files) {

    // short-curcuit if pages are not found
    if (err && err.code === 'ENOENT') {
      console.warn(configs.pages.dir + 'does not exist. Skipping pages.');
      return callback(null, {});
    }

    // fail gracefully on other errors 
    if (err) { return callback(err); }

    // iterate over each file
    files.forEach(function(file) {
      // assemble the page object
      var page = {};
      
      // parse out the page name
      var extension = path.extname(file);
      page.name     = path.basename(file, extension);
      
      // ignore non-markdown files
      if (configs.markdownExtensions.indexOf(extension)) {
        // assemble what will be the pages's URL
        page.url  = '/' + page.name;

        // read the file
        page.raw = fs.readFileSync(configs.pages.dir + file, 'utf8');

        // parse out the page body
        var contents  = fm.parse(page.raw);
        page.markdown = contents.body;
        
        // parse out the front-matter
        for (var attr in contents.attributes) {
          page[attr] = contents.attributes[attr];
        }

        // render the markdown
        page.content = remarkable.render(page.markdown);
        
        // free some memory
        delete page.markdown;
        delete page.raw;

        // buffer the page
        wit.pages[page.name] = page;
      }
    });

    callback();
  });
};
