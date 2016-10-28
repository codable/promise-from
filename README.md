Promise Wait
============

This is a simple wrapper to create Promise. This module utilize the [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) feature provided by ES6.

Install
-------

```Bash
npm install promise-wait
```

Usage
-----

```Node.JS
const fs = require('fs');
const promiseWait = require('promise-wait');

Promise.wait(fs.createWriteStream('hello'))
.end('hello, promise')
.then(function() {
  console.log('This is good promise');
})
.catch(function(err) {
  console.error(err);
});
```

License
-------

MIT
