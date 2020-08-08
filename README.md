# JavaScriptToString

[![NPM version](https://badge.fury.io/js/%40lopatnov%2Fjavascripttostring.svg)](https://www.npmjs.com/package/@lopatnov/javascripttostring)
[![License](https://img.shields.io/github/license/lopatnov/jsToString)](https://github.com/lopatnov/jsToString/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/lopatnov/jsToString.png?branch=master)](https://travis-ci.org/lopatnov/jsToString)
[![Twitter](https://img.shields.io/twitter/url?url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lopatnov%2Fjavascripttostring)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lopatnov%2Fjavascripttostring)

JavaScript value to string runtime converter. It converts a runtime value into string a value.

## Install

[![https://nodei.co/npm/@lopatnov/javascripttostring.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/@lopatnov/javascripttostring.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/@lopatnov/javascripttostring)

```shell
npm install @lopatnov/javascripttostring
```

[Browser](//lopatnov.github.io/jsToString/dist/javascripttostring.umd.js)

```html
<script src="//lopatnov.github.io/jsToString/dist/javascripttostring.umd.js"></script>
```

## Import package to the project

### TypeScript

```typescript
import javaScriptToString from '@lopatnov/javascripttostring';
```

### JavaScript

```javascript
var javaScriptToString = require("@lopatnov/javascripttostring");
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

## Examples

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

```javascript
var x = [1,2,3];
x[0] = x;
console.log(javaScriptToString(x));

/*
"(function(){ var ___j2s_0 = [null, 2, 3]; ___j2s_0['0'] = ___j2s_0;  return ___j2s_0; }())"
*/
```

## Demo

See, how it's working: [https://runkit.com/lopatnov/javascripttostring-demo](https://runkit.com/lopatnov/javascripttostring-demo)

Test it with a runkit: [https://npm.runkit.com/%40lopatnov%2Fjavascripttostring](https://npm.runkit.com/%40lopatnov%2Fjavascripttostring)

## Changelog

| Version | Task |
|--------:|:-----|
|   1.7.2 | Add recognition of native functions |
|         | Add recognition of non-standard property names |
|   1.7.0 | [Resolve references to parent elements and itself](https://github.com/lopatnov/jsToString/issues/1) |

## Rights and Agreements

License [Apache-2.0](https://github.com/lopatnov/jsToString/blob/master/LICENSE)

Copyright 2019–2020 Oleksandr Lopatnov
