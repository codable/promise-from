'use strict';

require('./finally');

function toPromise(value) {
  if (value && value.then) return value;
  return Promise.resolve(value);
}

function startPromise(that, resolve, reject, result) {
  let calls = that.__promiseCalls;
  if (calls.length === 0) {
    that.__promiseCalls = [];
    result = resolve(result);
    return toPromise(result);
  }

  let call = calls.shift();
  let func = call[0];
  let argumentsList = call[1];
  argumentsList.push(function nodeHandler(err, value) {
    if (err) {
      that.__promiseCalls = [];
      return toPromise((reject || Promise.reject)(err));
    }
    startPromise(that, resolve, reject, value);
  });
  func.apply(that, argumentsList);
}

function chain(func, cb) {
  let err = null;
  let value = null;
  try {
    value = func(cb);
  } catch (e) {
    err = e;
  }
  if (func.length === 0)
    cb(err, value);
}

function expect(good, bad, cb) {
  cb = cb || bad;
  bad = ((bad instanceof Function) ? 'error' : bad);

  function goodHandler(data) {
    this.removeListener(bad, badHandler);
    cb(null, data);
  }

  function badHandler(err) {
    this.removeListener(good, goodHandler);
    cb(err);
  }

  this.once(good, goodHandler);
  this.once(bad, badHandler);
}

let proxyGetHandler = {
  get: function(that, property, receiver) {
    let p = that[property];

    if (p === undefined) {
      if (property === 'then') {
        return function(onResolve, onReject) {
          return new Promise(function(resolve, reject) {
            startPromise(that, resolve, reject);
          }).then(onResolve, onReject);
        };
      } else if (property === 'catch') {
        return function(onReject) {
          return new Promise(function(resolve, reject) {
            startPromise(that, resolve, reject);
          }).catch(onReject);
        };
      } else if (property === 'finally') {
        return function(onFinally) {
          return new Promise(function(resolve, reject) {
            startPromise(that, resolve, reject);
          }).then(onFinally, onFinally);
        };
      } else if (property === 'expect') {
        p = expect;
      } else if (property === 'chain') {
        p = chain;
      } else {
        return undefined;
      }
    }

    if (!(p instanceof Function)) return p;

    return new Proxy(p, that.__promiseApplyHandler);
  }
}

function ProxyApplyHandler(that) {
  this.that = that;
}

ProxyApplyHandler.prototype.apply = function(func, obj, argumentsList) {
  this.that.__promiseCalls.push([func, argumentsList]);
  return obj;
};

Promise.from = function(that) {
  that.__promiseCalls = [];
  that.__promiseApplyHandler = new ProxyApplyHandler(that);
  return new Proxy(that, proxyGetHandler);
};

module.exports = Promise.from;
