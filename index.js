'use strict';

let proxyGetHandler = {
  get: function(that, property) {
    let p = that[property];
    if (!(p instanceof Function)) return p;

    return new Proxy(p, new ProxyApplyHandler(that));
  }
};

function ProxyApplyHandler(that) {
  this.that = that;
  this.rejected = false;
}

ProxyApplyHandler.prototype.apply = function(func, obj, argumentsList) {
  return new Promise((resolve, reject) => {
    if (this.that.on && this.that.on === func) {
      this.that.once('error', function(err) {
        reject(err);
      });
    }
    argumentsList.push(function nodeHandler(err, value) {
      if (err) reject(err);
      else resolve(value);
    });
    func.apply(this.that, argumentsList);
  });
};

Promise.from = function(that) {
  return new Proxy(that, proxyGetHandler);
};

module.exports = Promise.from;
