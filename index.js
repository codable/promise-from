let proxyGetHandler = {
  get: function(that, property) {
    let p = that[property];
    if (!(p instanceof Function)) return p;

    return new Proxy(p, proxyApplyHandler);
  }
};

let proxyApplyHandler = {
  apply: function(func, obj, argumentsList) {
    return new Promise(function(resolve, reject) {
      argumentsList.push(function nodeHandler(err, value) {
        if (err) reject(err);
        else resolve(value);
      });
      func.apply(obj, argumentsList);
    });
  }
};

Promise.wait = function(that) {
  return new Proxy(that, proxyGetHandler);
};

module.exports = Promise.wait;
