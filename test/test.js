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
      return Promise.from(out).expect('open').then(function() {
        return Promise.reject(new Error('Permission error expected'));
      }).catch(function(err) {
        assert(err);
      });
    });

    it('should be able to call chainable', function() {
      var filename = 'test.out';
      return Promise.from(fs.createWriteStream(filename))
      .write('good')
      .write('good')
      .write('study')
      .write('day')
      .write('day')
      .end('up')
      .then(function() {
        return Promise.from(fs).unlink(filename);
      })
      .catch(function(err) {
        assert(err);
      });
    });

    it('should be able to expect events', function() {
      var filename = 'test.out';
      return Promise.from(fs.createWriteStream(filename))
      .expect('open')
      .write('good')
      .end('bad')
      .catch(function(err) {
        console.log('bad');
      });
    });

    it('should be able to catch errors', function() {
      return Promise.from(fs.createWriteStream('/no'))
      .expect('open')
      .then(function() {
        return Promise.reject(new Error('Permission error expected'));
      })
      .catch(function(err) {
        assert.equal(err.errno, -13);
      });
    });
  });

  describe('finally', function() {
    const dns = require('dns');
    it('should always be called if promise resolved', function(done) {
      var resolved = false;
      Promise.from(dns).resolve('google.com').then(function(ans) {
        resolved = true;
      }).finally(function() {
        assert.ok(resolved);
        done();
      });;
    });

    it('should always be called if promise rejected', function(done) {
      var rejected = false;
      Promise.from(dns).resolve('=.com').catch(function(ans) {
        rejected = true;
      }).finally(function() {
        assert.ok(rejected);
        done();
      });;
    });

    it('should be able to start pending operations', function(done) {
      Promise.from(dns).resolve('=.com').finally(function() {
        done();
      });;
    });

    it('should be able to chain after finally', function(done) {
      Promise.from(dns).resolve('=.com').finally(function() {
        return true
      }).then(function(ok) {
        assert(ok);
        done();
      });
    });
  });

  describe('chain', function() {
    const dns = require('dns');
    it('should be able to chain some synchronous operations', function(done) {
      let chained = false;
      Promise.from(dns).resolve('google.com').chain(function() {
        chained = true;
      }).then(function(ans) {
        assert.ok(chained);
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });
});
