"use strict";

var assert = require("assert");
var EventEmitter = require("events");

var promising = require("../");

describe("promise-adapter", function () {
    describe("async function", function () {
        it("should throw a error", function (done) {
            try {
                promising();
                done(new Error);
            } catch (ex) {
                done();
            }
        });
        it("should returns a promise", function () {
            var test = function test(cb) {
                process.nextTick(function () {
                    cb();
                });
            };
            var pTest = promising(test);
            assert.ok(pTest() instanceof Promise);
        });
        it("should returns a value", function (done) {
            var test = function test(cb) {
                process.nextTick(function () {
                    cb(1);
                });
            };
            var pTest = promising(test);
            pTest().then(function (val) {
                assert.strictEqual(val[0], 1);
                done();
            }).catch(done);
        });
        it("should catch throw error", function (done) {
            var test = function test(cb) {
                process.nextTick(function () {
                    cb(new Error);
                });
            }
            var pTest = promising(test);
            pTest().then(function () {
            }, function () {
                done();
            });
        });
        it("should the this equal when pass second arguments", function (done) {
            var a = {};
            var test = function test(cb) {
                var that = this;
                process.nextTick(function () {
                    if (a === that) {
                        cb(null);
                    } else {
                        cb(new Error);
                    }
                });
            }
            var pTest = promising(test, a);
            pTest().then(function (val) {
                done();
            }, done);
        });
        it("should caught when emit error event", function (done) {
            function test(cb) {
                var evt = new EventEmitter;
                process.nextTick(function () {
                    evt.emit("error", new Error);
                });
                return evt;
            };
            var pTest = promising(test);
            pTest().then(function () {}, function () {
                done();
            });
        });
    });
    
    describe("sync function", function () {
        it("should catch throw error", function (done) {
            var test = function test(cb) {
                throw new Error;
            }
            var pTest = promising(test, null, true);
            pTest().then(function () {
            }, function () {
                done();
            });
        });
        it("should be returns a value", function (done) {
            var test = function () {
                return 1;
            };
            var pTest = promising(test, true);
            pTest().then(function (val) {
                assert.strictEqual(val[0], 1);
                done();
            }, done);
        });
        it("should be returns a value", function (done) {
            var test = function () {
                return 1;
            };
            var pTest = promising(test, null, true);
            pTest().then(function (val) {
                assert.strictEqual(val[0], 1);
                done();
            }, done);
        });
    });
});
