var loadArchive = require('../loadArchive');
var should      = require('should');
var wit         = require('./mock/wit');

// test
describe('loadArchive', function() {
  var archive = {};

  // init the archive
  before(function() {
    loadArchive(wit, function(nil, arch) {
      archive = arch;
    });
  });

  it ('should properly assemble the archive object', function() {
    Object.keys(archive).sort().should.be.eql(['2013', '2014']);
    Object.keys(archive['2014']).length.should.be.eql(1);
    Object.keys(archive['2014']['03']).length.should.be.eql(2);
    archive['2013']['01']['01'].should.have.property('baz');
  });
});
