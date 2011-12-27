/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true newcap: true undef: true es5: true node: true devel: true
         forin: true */
/*global define: true */

(typeof define === "undefined" ? function ($) { $(require, exports, module) } : define)(function (require, exports, module, undefined) {

"use strict";

var usage = require('../core')
var use = usage.use, DSL = usage.DSL

function descriptor(source) {
  var value = {}
  Array.prototype.slice.call(arguments).forEach(function onEach(properties) {
    Object.getOwnPropertyNames(source).forEach(function(name) {
      value[name] = Object.getOwnPropertyDescriptor(source, name)
    })
  })
  return value
}

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

exports['test smoke'] = function(assert) {
  var f1 = {
    a: 1,
    b: 2,
    c: 3,
    d: 4
  }

  var query = use(f1).as(Hash).
      merge({ x: 12, y: 13 }).
      filter('a', 'b', 'x').
      run()

  assert.deepEqual(query, { x: 12, a: 1, b: 2 }, 'expected result')
}

if (module == require.main)
  require("test").run(exports);

})
