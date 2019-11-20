# JavaScriptToString

[![NPM version](https://badge.fury.io/js/javascripttostring.svg)](https://badge.fury.io/js/javascripttostring)
![License](https://img.shields.io/github/license/lopatnov/jsToString)
[![Build Status](https://travis-ci.org/lopatnov/jsToString.png?branch=master)](https://travis-ci.org/lopatnov/jsToString)
[![Twitter](https://img.shields.io/twitter/url?url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fjavascripttostring)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fjavascripttostring)

JavaScript value to string runtime converter. It converts a runtime value into string a value.

# Install

Node:

[NPM repository](//www.npmjs.com/package/javascripttostring)

[![https://nodei.co/npm/javascripttostring.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/javascripttostring.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/javascripttostring)

```shell
npm install javascripttostring
```

[GitHub repository](//github.com/lopatnov/jsToString/packages)

```shell
npm install @lopatnov/javascripttostring
```

Browser:

```html
<script src="//lopatnov.github.io/jsToString/dist/javascripttostring.umd.js"></script>
```

## Import package to the project

```typescript
import javaScriptToString from 'javascripttostring';
```
or
```javascript
var javaScriptToString = require("javascripttostring");
```

## Convert JavaScript values into string values

```typescript
javaScriptToString(value: any, options?: IJ2SOptions) => string
```

where

```typescript
interface IJ2SOptions {
  includeFunctionProperties?: boolean; // default true
  includeFunctionPrototype?: boolean; // default true
  includeBuffers?: boolean; // default true
  nestedObjectsAmount?: number; // default Number.POSITIVE_INFINITY
  nestedArraysAmount?: number; // default Number.POSITIVE_INFINITY
  nestedFunctionsAmount?: number; // default Number.POSITIVE_INFINITY
}
```

# Examples

```typescript
let myStringOfString = javaScriptToString('Hello world');
console.log(myStringOfString);
/* expected myStringOfString value: "\"Hello world\"" */
```

```typescript
let myStringOfArray = javaScriptToString(["Hello", "World", ".", "How", "do", "you", "do", "?"]);
console.log(myStringOfArray);
/* expected myStringOfArray value: "[\"Hello\",\"World\",\".\",\"How\",\"do\",\"you\",\"do\",\"?\"]" */
```

```typescript
let myObjectString = javaScriptToString({
    friend1: "Shurik",
    friend2: "Alex",
    friends: {
        friend3: 123456,
        friend4: {},
        friend5: ["Hola", "amigo"],
        friend6: () => {
            console.log("How you doing?");
        }
    }
});

console.log(myObjectString);
/* expected myObjectString value:
"{friend1: \"Shurik\",friend2: \"Alex\",friends: {friend3: 123456,friend4: {},friend5: [\"Hola\",\"amigo\"],friend6: () => {
            console.log(\"How you doing?\");
        }}}"
*/
```

```typescript
let myFunctionString = javaScriptToString(function(a,b) {
  console.log("Just a function");
})

console.log(myFunctionString);
/* expected myFunctionString:
"function(a,b) {
  console.log(\"Just a function\");
}"
*/
```

```typescript
function Simple(title) {
  this.title = title || "world";
}

Simple.count = 0;

Simple.prototype.show = function(){
  Simple.count++;
  console.log('title = ', this.title);
  console.log('count = ', Simple.count);
}
console.log(javaScriptToString(Simple));

/* Expected:

"(function(){
 var Simple = function Simple(title) {
  this.title = title || \"world\";
};
 Simple.count = 0;

 Simple.prototype.show = function(){
  Simple.count++;
  console.log('title = ', this.title);
  console.log('count = ', Simple.count);
};

 return Simple;
}())"

*/
```

# Demo

See, how it's working: [https://runkit.com/lopatnov/javascripttostring-demo](https://runkit.com/lopatnov/javascripttostring-demo)

Test it with a runkit: [https://npm.runkit.com/javascripttostring](https://npm.runkit.com/javascripttostring)

# TBD

— [Resolve references to parent elements and itself](https://github.com/lopatnov/jsToString/issues/1)

# Rights and Agreements

License [Apache-2.0](https://github.com/lopatnov/jsToString/blob/master/LICENSE)

Copyright 2019 Oleksandr Lopatnov
