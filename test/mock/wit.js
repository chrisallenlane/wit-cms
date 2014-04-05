// mock the wit object
module.exports = {
  posts: {
    foo: {
      name       : 'foo',
      categories : ['foo'],
      date       : {
        year     : '2014',
        month    : '03',
        day      : '20',
      },
      tags       : ['alpha'],
    },

    bar          : {
      name       : 'bar',
      categories : ['foo', 'bar'],
      date       : {
        year     : '2014',
        month    : '03',
        day      : '10',
      },
      tags       : ['alpha', 'bravo'],
    },

    baz          : {
      name       : 'baz',
      categories : ['foo', 'bar', 'baz'],
      date       : {
        year     : '2013',
        month    : '01',
        day      : '01',
      },
      tags       : ['alpha', 'bravo', 'charlie'],
    },
  },
};
