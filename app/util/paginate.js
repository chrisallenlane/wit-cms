const sort = require('./sort');

module.exports = function(posts, params) {

  // nil guard. params are optional
  params = params || {};

  // sort the posts if they were passed as an object
  if (! Array.isArray(posts)) {
    posts = sort(posts);
  }

  // convert params to number type
  var page    = (Number(params.page) >= 1) ? Number(params.page) : 1;
  var perPage = Number(params.perPage) || 10;

  // count from zero
  var index   = (page >= 1) ? (page - 1) : 0;

  // slice the array
  var count   = Math.ceil(posts.length / perPage);
  var start   = index * perPage;
  var end     = start + perPage;

  // return the result as an object
  return {
    pagination: {
      count    : count,
      current  : page,
      next     : (page < count) ? page + 1 : false ,
      previous : (page <= 1)    ? false    : page - 1,
      perPage  : perPage,
    },
    posts : posts.slice(start, end),
  };
};
