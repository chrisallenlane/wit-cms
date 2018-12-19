// create a 302 redirect to the home page, if specified
module.exports = function(configs, app, wit) {

  if (! configs.pages.home) {
    return;
  }

  app.get('/', function(req, res) {
    res.redirect(302, configs.pages.home);
  });
};
