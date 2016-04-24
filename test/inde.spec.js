'use strict'

var chai = require('chai')
var expect = require('chai').expect
var Promise = require('pinkie-promise')
var sinonChai = require('sinon-chai')

chai.use(sinonChai)

var promiseBuffer = require('../').promiseBuffer

//

describe('Promise Buffer', function () {
  it('should be defined', function () {
    expect(promiseBuffer).to.be.a('function')
  })

  it('should return an object', function () {
    expect(promiseBuffer()).to.be.an('object')
  })

  describe('#push', function () {
    it('should be defined', function () {
      var buffer = promiseBuffer()
      expect(buffer.push).to.be.a('function')
    })

    it('should be called with a function', function () {
      var buffer = promiseBuffer()
      expect(buffer.push).to.throw(Error, /AssertionError: Expect a function as first argument/)
    })

    it('should return an object', function () {
      var buffer = promiseBuffer()
      var res = buffer.push(function () {})
      expect(res.then).to.be.an('function')
    })

    it('should call done on nextTick', function () {
      var buffer = promiseBuffer()
      return buffer.push(function () {})
    })

    it('should call pushed function in order', function () {
      var buffer = promiseBuffer()
      var a = 0

      buffer.push(function () {
        a++
      })

      return buffer.push(function () {
        expect(a).to.equal(1)
      })
    })

    it('should auto reset the buffer', function (done) {
      var buffer = promiseBuffer()
      var a = 0

      buffer.push(function () { a++ })
      buffer
        .push(function () { a++ })
        .then(process.nextTick.bind(null, secoundWave))

      function secoundWave () {
        buffer.push(function () { a++ })
        buffer
          .push(function () { a++ })
          .then(function () {
            expect(a).to.equal(4)
          })
          .then(done, done)
      }
    })
  })
})
