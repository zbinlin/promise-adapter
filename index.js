"use strict";

/**
 * Convert node-style callback to promise
 * the promise.then's callback function's arguments is an array value.
 * if func is async, the value of array corresponding func's callback function's arguments,
 * except first argument is an Error type or null.
 * if func is sync, the first value of array corresponding func returns value.
 * @function
 * @param {Function} func - must be a sync or async function. if it is sync,
 *  isSync must be set true. Default it is async function.
 * @param {*} [thisArg = undefined] - binding to func. if func not use **this**,
 *  it can omits. Default: undefined;
 * @param {boolean} [isSync = false] - if func is a sync function, it is true.
 * @returns {Function}
 * @example
 * ```js
 * let promising = require("promise-adapter");
 * let readFile = promising(fs.readFile, fs); // or: let readFile = promising(fs.readFile.bind(fs));
 * readFile("index.js").then(function (val) {
 *     let data = val[0];
 *     console.log(data);
 * }, function (err) {
 *     console.error(err);
 * });
 * ```
 */
module.exports = function _promising(func, thisArg, isSync) {
    if (typeof func !== "function") {
        throw new TypeError("arguments 0 must be a function.");
    }
    if (arguments.length === 2 && typeof thisArg === "boolean") {
        isSync = thisArg;
        thisArg = undefined;
    }
    func = func.bind(thisArg);
    return (function _(func, isSync) {
        return function _get_promise() {
            var args = [].slice.call(arguments);
            var executor = (function _(func, args, isSync) {
                return function _executor(resolve, reject) {
                    if (isSync) {
                        resolve([func.apply(undefined, args)]);
                    } else {
                        func.apply(undefined, args.concat(asyncCallback));
                    }
                    function asyncCallback(err) {
                        var args = [].slice.call(arguments);
                        if (err instanceof Error) {
                            return reject(err);
                        } else if (err === null) {
                            args.shift();
                        }
                        return resolve(args);
                    }
                };
            })(func, args, isSync);
            return new Promise(executor);
        };
    })(func, !!isSync);
};
