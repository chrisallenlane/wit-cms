const Remarkable = require('remarkable');
const fm         = require('json-front-matter');
const fs         = require('fs');
const lodash     = require('lodash');
const path       = require('path');

module.exports = function(configs) {

  // vars
  const pages = {};
  var files   = [];

  // initialize the markdown parser
  const remarkable = new Remarkable(configs.markdown.remarkable);

  // read the directory containing page files
  try {
    files = fs.readdirSync(configs.pages.dir);
  } catch (err) {

    // short-curcuit if pages are not found
    if (err && err.code === 'ENOENT') {
      console.warn(configs.pages.dir + ' does not exist. Skipping pages.');
      return {};
    }
    
    // throw other errors
    else { throw err; }
  }

  // iterate over each file
  files.forEach(function(file) {

    // assemble the page object
    const page = {};
    
    // parse out the page name
    const extension = path.extname(file);
    page.name       = path.basename(file, extension);
    
    // ignore non-markdown files
    if (configs.markdown.extensions.indexOf(extension)) {

      // assemble the page's URL
      page.url = '/' + lodash.trimStart((page.url || page.name), '/');

      // read the file
      page.raw = fs.readFileSync(configs.pages.dir + file, 'utf8');

      // parse out the page body
      const contents = fm.parse(page.raw);
      page.markdown  = contents.body;
      
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
      pages[page.name] = page;
    }
  });

  // return the page objects
  return pages;
};
