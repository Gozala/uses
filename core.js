/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true
         forin: true latedef: false supernew: true */
/*global define: true */

!(typeof(define) !== "function" ? function($) { $(typeof(require) !== 'function' ? (function() { throw Error('require unsupported'); }) : require, typeof(exports) === 'undefined' ? this : exports, typeof(module) === 'undefined' ? {} : module); } : define)(function(require, exports, module) {

'use strict';

var Base = require('selfish').Base
var slice = Function.prototype.call.bind(Array.prototype.slice)

var Role = Base.extend({
  initialize: function initialize(actor) {
    this.actor = actor
  },
  as: function as(role) {
    return role.new(this.actor)
  }
})
exports.Role = Role

var DSL = Role.extend({
  via: 'this',
  extend: function extend(methods) {
    var descriptor = {}
    Object.getOwnPropertyNames(methods).forEach(function(name) {
      if (typeof(methods[name]) !== 'function')
        descriptor[name] = methods[name]
      else
        descriptor[name] = { value:  function method() {
          var params = slice(arguments)
          if (this.via === 'first') params.unshift(this.actor)
          if (this.via === 'last') params.push(this.actor)
          this.actor = methods[name].apply(this.actor, params)
          return name === 'run' ? this.actor : this
        }, enumerable: true }
    }, this)
    return Object.create(this, descriptor)
  },
  run: function run() {
    return this.actor
  }
})
exports.DSL = DSL

var Target = Role.extend({
  via: 'last',
  run: function run(task) {
    if (!task) return this.actor
    var actor = this.actor
    var params = Array.prototype.slice.call(arguments, 1)
    if (this.via === 'first') params.unshift(actor)
    if (this.via === 'last') params.push(actor)
    this.actor = task.apply(actor, params)
    return this
  }
})
exports.Target = Target

function fab(value) {
  function dsl(task) {
    if (task === fab.run) return dsl.value
    var params = Array.prototype.slice.call(arguments)
    var fn = params.shift()
    params.push(value)
    dsl.value = fn.apply(this, params)
    return dsl
  }
  dsl.value = value
  return dsl
}
fab.new = function(value) { return fab(value) }
fab.run = function run() {}
exports.fab = fab

function use(actor) {
  return Role.new(actor)
}
exports.use = use

});
