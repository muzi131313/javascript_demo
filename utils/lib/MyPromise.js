function MyPromise(excutor) {
  this.value = undefined
  this.status = 'pending'
  this.onResolveCallback = []
  this.onRejectCallback = []

  const self = this
  this.resolve = function(value) {
      if (self.status === 'pending') {
          self.value = value
          self.status = 'resolved'
          for (var i in self.onResolveCallback) {
              self.onResolveCallback[i](value)
          }
      }
  }
  this.reject = function(value) {
      if (self.status === 'pending') {
          self.value = value
          self.status = 'rejected'
          for (var i in self.onRejectCallback) {
              self.onRejectCallback[i](value)
          }
      }
  }

  excutor(this.resolve.bind(this), this.reject.bind(this))
}

MyPromise.prototype.then = function(onResolved, onRejected) {
  const self = this
  const status = this.status

  onResolved = typeof onResolved === 'function' ? onResolved : function(value){ return value }
  onRejected = typeof onRejected === 'function' ? onRejected : function(reason) { throw reason }

  if (status === 'pending') {
      return new MyPromise((resovle, reject) => {
          self.onResolveCallback.push(function(value) {
              try {
                  var t = onResolved(value)
                  if (t instanceof MyPromise) {
                      return t.then(resolve, reject)
                  }
              }
              catch (e) {
                  reject(e)
              }
          })
          self.onRejectCallback.push(function(value) {
              try {
                  var t = onRejected(value)
                  if (t instanceof MyPromise) {
                      return t.then(resolve, reject)
                  }
              }
              catch (e) {
                  reject(e)
              }
          })
      })
  }
  if (status === 'resolved') {
      return new MyPromise((resolve, reject) => {
          try {
              var t = onResolved(self.data)
              if (t instanceof MyPromise) {
                  return t.then(resolve, reject)
              }
          }
          catch (e) {
              reject(e)
          }
      })
  }
  if (status === 'rejected') {
      return new MyPromise((resolve, reject) => {
          try {
              var t = onRejected(self.data)
              if (t instanceof MyPromise) {
                  return t.then(resolve, reject)
              }
          }
          catch (e) {
              reject(e)
          }
      })
  }
}

MyPromise.prototype.catch = function(onRejected) {
  this.then(null, onRejected)
}

// test case
var t = new MyPromise(resolve => {
  setTimeout(() => {
      resolve('hello')
  }, 0)
})
// 调用完then之后，给放到了callback中，在Promise构造函数中的 resolve 调用时，onResolveCallback 数组中就有值了
t
.then(d => {
  consol.log('d: ', d)
})
.catch(e => {
  console.log(e)
})
