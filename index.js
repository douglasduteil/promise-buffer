'use strict'

var assert = require('assert')
var debug = require('debug')('promise-buffer')
var Promise = require('pinkie-promise')

//

exports.promiseBuffer = promiseBuffer

//

function promiseBuffer () {
  debug('new')
  var bufferState = newBufferState()

  return {
    push: push.bind(null, bufferState)
  }
}

function newBufferState () {
  var state = {
    buffer: [],
    laterRunRegistered: false
  }

  state.pendingPromise = new Promise(function (resolve, reject) {
    state.finalResolve = resolve
    state.finalReject = reject
  })

  return state
}

function push (state, promiseTorun) {
  debug('push %j', state)
  assert.equal(typeof state, 'object', 'Expect a state')
  assert.equal(typeof promiseTorun, 'function', 'Expect a function as first argument')

  state.buffer.push(promiseTorun)

  state.laterRunRegistered = registerLaterRun(state)
  return state.pendingPromise
}

function registerLaterRun (state) {
  if (state.laterRunRegistered) {
    return state.laterRunRegistered
  }

  debug('registerLaterRun')
  process.nextTick(processBuffer.bind(null, state))
  return true // means that it's running
}

function processBuffer (state) {
  const chainedPromises = state.buffer.reduce(function (latestPromise, promiseTorun) {
    return latestPromise.then(promiseTorun)
  }, Promise.resolve())

  return chainedPromises
    .then(state.finalResolve)
    .catch(state.finalReject)
    .then(function () {
      debug('reset state')
      Object.assign(state, newBufferState())
    })
}
