if (Promise.prototype.finally) return;

Promise.prototype.finally = function(onFinally) {
  return this.then(onFinally, onFinally);
}
