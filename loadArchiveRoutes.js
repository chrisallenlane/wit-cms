module.exports = function (wit, callback) {
  var app     = wit.app;
  var archive = wit.archive;
  
  // specific archive pages
  app.get('/blog/archive/:year/:month/:day/:post', function(req, res) {
    var posts = [];
    var year  = req.params.year;
    var month = req.params.month;
    var day   = req.params.day;
    var post  = archive[year][month][day][req.params.post];

    res.render('post', {
      bodyClass    : 'archive',
      canonicalUrl : post.url,
      description  : post.description,
      date         : {
        year  : req.params.year,
        month : req.params.month,
        day   : req.params.day,
      },
      post         : post,
      title        : post.title || 'Archive',
    });
  });

  // archive by day
  app.get('/blog/archive/:year/:month/:day', function(req, res) {
    var posts = [];
    var year  = req.params.year;
    var month = req.params.month;
    var day   = req.params.day;

    for (var postName in archive[year][month][day]) {
      posts.push(archive[year][month][day][postName]);
    }
    
    // sort the posts by date
    posts        = wit.sort(posts);
    var nextPrev = wit.nextPrev(posts, req.query.p);
    posts        = wit.paginate(posts, req.query.p);

    res.render('archive', {
      bodyClass : 'archive',
      date      : {
        year  : req.params.year,
        month : req.params.month,
        day   : req.params.day,
      },
      nextPrev  : nextPrev,
      posts     : posts,
      title     : 'Archive',
    });
  });

  // archive by month
  app.get('/blog/archive/:year/:month', function(req, res) {
    var posts = [];
    var year  = req.params.year;
    var month = req.params.month;

    for (var day in archive[year][month]) {
      for (var postName in archive[year][month][day]) {
        posts.push(archive[year][month][day][postName]);
      }
    }

    // sort the posts by date
    posts        = wit.sort(posts);
    var nextPrev = wit.nextPrev(posts, req.query.p);
    posts        = wit.paginate(posts, req.query.p);

    res.render('archive', {
      bodyClass : 'archive',
      date      : {
        year  : req.params.year,
        month : req.params.month,
      },
      nextPrev  : nextPrev,
      posts     : posts,
      title     : 'Archive',
    });
  });

  // archive by year
  app.get('/blog/archive/:year', function(req, res) {
    var posts = [];
    var year  = req.params.year;

    for (var month in archive[year]) {
      for (var day in archive[year][month]) {
        for (var postName in archive[year][month][day]) {
          posts.push(archive[year][month][day][postName]);
        }
      }
    }

    // sort the posts by date
    posts        = wit.sort(posts);
    var nextPrev = wit.nextPrev(posts, req.query.p);
    posts        = wit.paginate(posts, req.query.p);

    res.render('archive', {
      bodyClass : 'archive',
      date: {
        year : req.params.year,
      },
      nextPrev  : nextPrev,
      posts     : posts,
      title     : 'Archive',
    });
  });

  callback(null, null);
};
