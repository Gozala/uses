# uses

[![Build Status](https://secure.travis-ci.org/Gozala/uses.png)](http://travis-ci.org/Gozala/uses)

There are just too many use cases, when you might find that methods exposed by
built-ins is not enough. Also, different libraries try to fix in a different
ways:

1. Libraries like [sugarjs] extend built-ins with a collection of helpful
   methods, that provide natural and concise API, which still may or may not
   fit your use case (if not, you're back to the original problem).

2. Libraries like [underscore] provide handful utility functions. Unfortunately
   those are not as chaining friendly (degrade code readability when chaining
   multiple actions) and have different signature from built-ins.

```js
var sum = _.reduce(_.map(_.filter(numbers, function(n) {
  return n % 2
}), function(num) {
  return num * 3
}), function(memo, n) {
  return memo + n
}, 0)
```

This library tries to provide a natural, chainable API that is not limited to
any collection of heldful methods, in fact it does not comes with thouse and
encourages to build / reuse use case specific methods and collections.

## Examples

### Any functions with generic DSL

```js
var uses = require('uses'), use = uses.use, Target = uses.Target

function merge() {
  var sources = Array.prototype.slice.call(arguments)
  var target = sources.pop()
  var whitelist = {}
  sources.forEach(function(source) {
    var properties = descriptor(source)
    Object.keys(properties).forEach(function(name) {
      whitelist[name] = properties[name]
    })
  })
  return Object.defineProperties(target, whitelist)
}

function filter() {
  var names = Array.prototype.slice.call(arguments)
  var source = names.pop()
  var properties = descriptor(source)
  var whitelist = {}
  names.forEach(function(name) {
    whitelist[name] = properties[name]
  })
  return Object.create(Object.getPrototypeOf(source), whitelist)
}

var actual = use({ a: 1, b: 2, c: 3, d: 4 }).as(Target).
  run(merge, { x: 12, y: 13 }).
  run(filter, 'a', 'b', 'x').
  run()
  // => { x: 12, a: 1, b: 2 }
```

### Define custom DSL

```js
var uses = require('uses'), use = uses.use, DSL = uses.DSL

// Define methods useful for working with objects like hashes.
var Hash = DSL.extend({
  merge: function merge(properties) {
    return Object.defineProperties(this, descriptor(properties))
  },
  filter: function filter() {
    var properties = descriptor(this)
    var whitelist = {}
    Array.prototype.slice.call(arguments).forEach(function(name) {
      whitelist[name] = properties[name]
    })
    return Object.create(Object.getPrototypeOf(this), whitelist)
  }
})

var hash = use({ a: 1, b: 2, c: 3, d: 4 }).as(Hash).
  merge({ x: 12, y: 13 }).
  filter('a', 'b', 'x').
  run()
  // => { x: 12, a: 1, b: 2 }
```

### Go crazy with [fab] inspired DSL

```js

var uses = require('uses'), use = uses.use, fab = uses.fab
// Same map / filter as in first example
var hash = use({ a: 1, b: 2, c: 3, d: 4 }).as(fab)
  (merge, { x: 12, y: 13 })
  (filter, 'a', 'b', 'x')
  (fab.run)
  // => { x: 12, a: 1, b: 2 }

```

## Install ##

    npm install uses

[fab]:http://fabjs.org/
[sugarjs]:http://sugarjs.com/
[underscore]:http://documentcloud.github.com/underscore/
