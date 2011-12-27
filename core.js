/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true
         forin: true latedef: false supernew: true */
/*global define: true */

!(typeof(define) !== "function" ? function($) { $(typeof(require) !== 'function' ? (function() { throw Error('require unsupported'); }) : require, typeof(exports) === 'undefined' ? this : exports, typeof(module) === 'undefined' ? {} : module); } : define)(function(require, exports, module) {

'use strict';

var Base = require('selfish').Base
var Role = Base.extend({
  new: function (actor) {
    var role = Object.create(this, {
      actor: { value: actor }
    })
    role.initialize.apply(role, arguments)
  },
  as: function as(role) {
    return role.new(this.actor)
  }
})
exports.Role = Role

var Target = Role.extend({
  run: function run() {
    var actor = this.actor
    var params = Array.prototype.slice.call(arguments)
    var task = params.shift()
    params.unshift(actor)
    var value = task.apply(actor, params)
    // If return value is `actor` (`this` pseudo-variable in the function
    // scope), then return `this` role currently taken by an actor to allow
    // chaining.
    return value === actor ? this : value
  }
})
exports.Target = Target

function fab(actor) {
  var tasks = []
  return function dsl(task) {
    if (task === fab.run) return fab.run(tasks, value)
    tasks.push(Array.prototype.slice.call(arguments))
    return dsl
  }
}
fab.new = function(actor) { return fab(actor) }
fab.run = function run(tasks, value) {
  if (!task.length)
  var params = tasks.shift()
  var fn = params.shift()
  params.push(value)
  return run(fn.apply(null, params))
}

function use(actor) {
  return Role.new(actor)
}
exports.use = use

});
