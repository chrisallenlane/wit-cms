const Remarkable = require('remarkable');
const config     = require('./config');
const configs    = config();
const fm         = require('json-front-matter');
const fs         = require('fs');
const path       = require('path');
const remarkable = new Remarkable(configs.remarkable);

module.exports = function(wit, callback) {
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
      const page = {};
      
      // parse out the page name
      const extension = path.extname(file);
      page.name     = path.basename(file, extension);
      
      // ignore non-markdown files
      if (configs.markdownExtensions.indexOf(extension)) {
        // assemble what will be the pages's URL
        page.url  = '/' + page.name;

        // read the file
        page.raw = fs.readFileSync(configs.pages.dir + file, 'utf8');

        // parse out the page body
        const contents  = fm.parse(page.raw);
        page.markdown = contents.body;
        
        // parse out the front-matter
        for (const attr in contents.attributes) {
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
