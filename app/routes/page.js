const lodash = require('lodash');

module.exports = function(app, wit, callback) {

  lodash.forEach(wit.pages, function(page) {

    app.get('/' + page.name, function(req, res) {
      res.render(page.view || 'page', {
        page : page,
        wit  : wit,
      });
    });

  });

  callback();
};
