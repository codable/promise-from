var assert = require('assert');
var promiseWait = require('../');

describe('promise-wait', function() {
  describe('fs', function() {
    it('should be able to create promise for file system module', function(done) {
      var filename = 'test.out';
      var data = 'hello promise';
      var fs = require('fs');
      promiseWait(fs.createWriteStream(filename))
      .end(data)
      .then(() => {
        var content = '';
        return promiseWait(fs.createReadStream(filename)
                           .on('data', function(data) {
                             content += data;
                           })).on('end').then(function() {
                             return content;
                           });
      }).then((content) => {
        assert.equal(content, data);
        return promiseWait(fs).unlink(filename);
      }).then(done, done);
    });
  });
});
