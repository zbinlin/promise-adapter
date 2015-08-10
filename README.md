# promise-adapter

Convert node-style callback to promise


## Install

```shell
npm install promise-adapter
```


## Usage

### Example 1

```js
var promising = require("promise-adapter");
function sqrtAsync(n, cb) {
    process.nextTick(function () {
        cb(n * n);
    });
}
var sqrt = promising(sqrtAsync);
sqrt(10).then(function (val) {
    var data = val[0];
    console.log(data); // 100
}, function (err) {
    console.error(err);
});
```

### Example 2

```js
var fs = require("fs");
var promising = require("promise-adapter");

var readFile = promising(fs.readFile.bind(fs));

readFile("index.js").then(function (val) {
    var data = val[0];
    console.log(data);
}, function (err) {
    console.error(err);
});
```

### Example 3

```js
var promising = require("promise-adapter");

var hello = function (cb) {
    var that = this;
    process.nextTick(function () {
        cb("Hello, My name is " + that.name + "!");
    });
};

var jim = {
    name: "Jim"
};
var kate = {
    name: "Kate"
};

var jimSayHello = promising(hello, jim);
var kateSayHello = promising(hello, kate);

jimSayHello().then(function (val) {
    var data = val[0];
    console.log(data); // Hello, My name is Jim!
}, function (err) {
    console.error(err);
});

kateSayHello().then(function (val) {
    var data = val[0];
    console.log(data); // Hello, My name is Kate!
}, function (err) {
    console.error(err);
});
```

### Example 4

```js
var promising = require("promise-adapter");

var addSync = function (a, b) {
    return a + b;
}

var add = promising(addSync, true);

add(1, 2).then(function (val) {
    var data = val[0];
    console.log(data); // 3
}, function (err) {
    console.error(err);
});
```
