const lodash = require('lodash');
const moment = require('moment');

module.exports = function(configs, app, wit) {
  const urlSet = lodash.values(wit.pages).concat(lodash.values(wit.posts));

  app.get('/sitemap.xml', function(req, res) {
    res.set('content-type', 'application/xml');

    res.render('sitemap', {
      page : {
        date    : { pubDate: moment().format() },
        content : urlSet,
      },
      wit : wit,
    });
  });

};
