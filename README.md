Promise From
============

This is very simple wrapper to adapt NodeJS style API to ES6 Promise. The module requires the [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) feature provided by ES6.

Features
--------

* Very simple to use
* Easy to chain async calls
* Support `expect`-like syntax to handle events
* Build-in Promise `finally` implementation
* Depend on Node.JS only

Install
-------

```Bash
npm install promise-from
```

Quick Start
-----------

```js
const fs = require('fs');
const promiseFrom = require('promise-from');

promiseFrom(fs.createWriteStream('hello'))
.expect('open')
.write('hello')
.chain(function() {
  console.info('this will be called and chained');
})
.chain(function(done) {
  console.info('this will be called and will continue to then() after done() is called');
  setTimeout(done, 1000);
})
.write('promise')
.then(function() {
  console.log('all operations are successful.');
})
.catch(function(err) {
  console.log('oops, something went wrong!');
  console.error(err);
})
.finally(function() {
  console.log('This will always be called.');
});
```

API
----

All function calls to the proxied object are recorded and executed after one of `then()`, `catch()` or `finally()` are called.

### expect(good, bad='error')

expect `good` event to resolve promise and `bad` event to reject.

### finally(onFinally)

called at the end of async operations whether to do clean up or if you don't care the result.

License
-------

MIT
