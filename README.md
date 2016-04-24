# promise-buffer  [![Build Status][travis-image]][travis-url] [![NPM version][npm-image]][npm-url] [![No Maintenance Intended][unmaintained-image]][unmaintained-url]

> Buffers promises and run them in order on the next tick 

## Installation

promise-buffer can be installed using

```sh
$ npm install --save promise-buffer
```

## Usage

```js
var buffer = require('promise-buffer').promiseBuffer()
class Abc {
  foo () {
    buffer.push(() => {
      console.log('foo')
    })
    return this
  }

  bar () {
    buffer.push(() => {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          console.log('bar')
          resolve()
        }, 1000)
      })
    })
    return this
  }
}


var abc = new Abc()
abc.foo().bar().foo()
// foo
// bar
// foo
```




[npm-url]: https://npmjs.org/package/promise-buffer
[npm-image]: http://img.shields.io/npm/v/promise-buffer.svg
[travis-url]: http://travis-ci.org/douglasduteil/promise-buffer
[travis-image]: http://travis-ci.org/douglasduteil/promise-buffer.svg?branch=master
[unmaintained-image]: http://unmaintained.tech/badge.svg
[unmaintained-url]: http://unmaintained.tech