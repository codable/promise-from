if (Promise.prototype.finally) return;

Promise.prototype.finally = function(onFinally) {
  function resolveHandler(value) {
    let ret = onFinally();
    if (ret === undefined) ret = value;
    return ret;
  }
  function rejectHandler(err) {
    let ret = onFinally();
    if (ret === undefined) ret = err;
    return Promise.reject(err);
  }
  return this.then(resolveHandler, rejectHandler);
}
