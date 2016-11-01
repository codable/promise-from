if (Promise.prototype.finally) return;

Promise.prototype.finally = function(onFinally) {
  this.then(onFinally, onFinally);
}
