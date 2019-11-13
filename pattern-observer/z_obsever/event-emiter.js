class EventEmitter {
  constructor() {
      this._events = this._events || new Map()
  }
}
EventEmitter.prototype.addListener = function(type, fn) {
  var _events = this._events
  var events = _events.get(type)
  if (Array.isArray(events)) {
      events.push(fn)
  }
  else if (events && typeof events === 'function') {
      _events.set(type, [ events, fn ])
  }
  else {
      _events.set(type, fn)
  }
}
EventEmitter.prototype.emitEvent = function(event, args) {
  if (args && args.length) {
      event.apply(this, args)
  }
  else {
      event.call(this)
  }
}
EventEmitter.prototype.emit = function(type, ...args) {
  var events = this._events.get(type)
  if (Array.isArray(events)) {
      events.forEach(event => {
          this.emitEvent(event, args)
      })
  }
  else if (events && typeof events === 'function') {
      this.emitEvent(events, args)
  }
  else {
      throw new Error('you are emited an not existed event')
  }
}
EventEmitter.prototype.removeListener = function(type, fn) {
  var _events = this._events
  var events = _events.get(type)
  if (Array.isArray(events)) {
      var eventIndex = events.findIndex(event => event === fn)
      events.splice(eventIndex, 1)
      if (events.length === 1) {
          _events.set(type, events[0])
      }
  }
  else if (events && events === fn) {
      _events.delete(type)
  }
  else {
      throw new Error('you are removed an not existed event')
  }
}

var eventEmitter = new EventEmitter()
var noArgs = function() {
  console.log('no args')
}
var oneArgs = function(one) {
  console.log('one args: ', one)
}
var twoArgs = function(one, two) {
  console.log('one args: ', two)
}
eventEmitter.addListener('click', noArgs)
eventEmitter.addListener('click', oneArgs)
eventEmitter.addListener('click', twoArgs)
eventEmitter.removeListener('click', twoArgs)
eventEmitter.emit('click', 1, 2)
