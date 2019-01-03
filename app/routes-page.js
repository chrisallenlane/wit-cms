const lodash = require('lodash');

module.exports = function(configs, app, wit) {

  lodash.forEach(wit.pages, function(page) {

    // set the route
    app.get(page.url, function(req, res) {
      res.render(page.view || 'page', {
        page : page,
        wit  : wit,
      });
    });
  });

};
