Promise From
============

This is a simple wrapper to create Promise. This module utilize the [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) feature provided by ES6.

Install
-------

```Bash
npm install promise-from
```

Usage
-----

```Node.JS
const fs = require('fs');
const promiseFrom = require('promise-from');

promiseFrom(fs.createWriteStream('hello'))
.expect('open')
.write('hello')
.write('promise')
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
