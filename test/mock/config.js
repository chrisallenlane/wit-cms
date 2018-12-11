module.exports = {

  // build configs
  build: {},

  // site configs
  params: {
    author  : 'John Doe',
    fqdn    : 'https://example.com',
    name    : 'Wit CMS Unit-Test Site',
    tagLine : 'A mock site for unit-testing.',
  },
  
  // page configs
  pages: {
    dir: './test/mock/pages/',
  },

  // post configs
  posts: {
    dir      : './test/mock/posts/',
    excerpt  : {
      length : 1,
      units  : 'paragraphs',
    },
    perPage : 5,
  },

};
