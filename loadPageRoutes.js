module.exports = function(wit, callback) {
  var app   = wit.app;
  var pages = wit.pages;

  Object.keys(pages).forEach(function(pageName) {
    var page = pages[pageName];
    var url  = '/' + page.name;

    app.get(url, function(req, res) {
      res.render(page.view || 'page', {
        bodyClass    : 'page ' + page.name,
        canonicalUrl : page.url,
        description  : page.description,
        page         : page,
        title        : page.title || '',
      });
    });
  });

  callback(null, null);
};
