var loadTags = require('../loadTags');
var should   = require('should');
var wit      = require('./mock/wit');

// test
describe('loadTags', function() {
  var tags = {};

  // init the archive
  before(function() {
    loadTags(wit, function(nil, t) {
      tags = t;
    });
  });

  it ('should properly assemble the tags object', function() {
    Object.keys(tags).sort().should.eql(['alpha', 'bravo', 'charlie']);
    Object.keys(tags.alpha).length.should.be.eql(3);
    Object.keys(tags.bravo).length.should.be.eql(2);
    Object.keys(tags.charlie).length.should.be.eql(1);
  });
});
