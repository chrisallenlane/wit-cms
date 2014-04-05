var loadCategories = require('../loadCategories');
var should         = require('should');
var wit            = require('./mock/wit');

// test
describe('loadCategories', function() {
  var categories = {};

  // init the archive
  before(function() {
    loadCategories(wit, function(nil, cats) {
      categories = cats;
    });
  });

  it ('should properly assemble the categories object', function() {
    Object.keys(categories).sort().should.eql(['bar', 'baz', 'foo']);
    Object.keys(categories.foo).length.should.be.eql(3);
    Object.keys(categories.bar).length.should.be.eql(2);
    Object.keys(categories.baz).length.should.be.eql(1);
  });
});
