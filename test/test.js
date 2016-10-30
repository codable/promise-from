var assert = require('assert');
var fs = require('fs');
require('../');

describe('promise-from', function() {
  describe('fs', function() {
    it('should be able to create promise for file system module', function(done) {
      var filename = 'test.out';
      var data = 'hello promise';
      Promise.from(fs.createWriteStream(filename))
      .end(data)
      .then(() => {
        var content = '';
        return Promise.from(fs.createReadStream(filename)
                           .on('data', function(data) {
                             content += data;
                           })).on('end').then(function() {
                             return content;
                           });
      }).then((content) => {
        assert.equal(content, data);
        return Promise.from(fs).unlink(filename);
      }).then(done, done);
    });

    it('should be able to reject promise for file system errors', function() {
      var out = fs.createWriteStream('/no-permission');
      Promise.from(out).on('open').then(function() {
        return Promise.reject(new Error('Permission error expected'));
      }).catch(function(err) {
        assert(err);
      });
    });
  });
});
