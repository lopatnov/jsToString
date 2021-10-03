# JavaScriptToString [![Twitter](https://img.shields.io/twitter/url?url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lopatnov%2Fjavascripttostring)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lopatnov%2Fjavascripttostring)

[![npm](https://img.shields.io/npm/dt/@lopatnov/javascripttostring)](https://www.npmjs.com/package/@lopatnov/javascripttostring)
[![NPM version](https://badge.fury.io/js/%40lopatnov%2Fjavascripttostring.svg)](https://www.npmjs.com/package/@lopatnov/javascripttostring)
[![License](https://img.shields.io/github/license/lopatnov/jsToString)](https://github.com/lopatnov/jsToString/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/lopatnov/jsToString)](https://github.com/lopatnov/jsToString/issues)
[![GitHub forks](https://img.shields.io/github/forks/lopatnov/jsToString)](https://github.com/lopatnov/jsToString/network)
[![GitHub stars](https://img.shields.io/github/stars/lopatnov/jsToString)](https://github.com/lopatnov/jsToString/stargazers)
![GitHub top language](https://img.shields.io/github/languages/top/lopatnov/jsToString)

[![Patreon](https://img.shields.io/badge/Donate-Patreon-informational)](https://www.patreon.com/lopatnov)
[![sobe.ru](https://img.shields.io/static/v1?label=sobe.ru&message=%D0%91%D0%BB%D0%B0%D0%B3%D0%BE%D0%B4%D0%B0%D1%80%D0%BD%D0%BE%D1%81%D1%82%D1%8C&color=yellow&logo=data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAArlBMVEUAAAD//////////////////////////////////////////////////////////////////PP/3l7/9c//0yb/zAD/6ZP/zQf/++7/3FD/88X/0h7//v7/5oX/zATUqQDktgD/5HjQpgAFBACQcwD/zw/fsgCOcQD6yADZrQD2xAD8yQDnuADxwADcsADbrwDpugD3xQD5xwDjtQDywQD+ywD9ygDvvwD7yAD/1jRaObVGAAAAEHRSTlMAA3zg707pEJP8MMUBYN5fiwXJMQAAAAFiS0dEAf8CLd4AAAAHdElNRQflBgMAAxO4O2jCAAAAuElEQVQoz42S1w7CMAxFS8ueYZgNLZuyRynw/z9GdtxIkbgPceQT6Tq2vZwfEKx8wRPyiaViSYDABqQsAMq0OzxUqhbo9kBcavUM6A9AAtJAYDgC0ID7i+t4AghwfxanszlAGBnA/Flc0MfL1doA5s/ChoLtbg8QI392gpIBzf/AwYAWAsdTrIE05/nz5Xq7S6DKpenHM0pe+o/qg5Am74/0ybTkm+q6wG4iltV2LTko52idy+Banx9RYiS6Vrsc3AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wNi0wM1QwMDowMzoxOCswMDowMLvSSCkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDYtMDNUMDA6MDM6MTgrMDA6MDDKj/CVAAAAAElFTkSuQmCC)](https://sobe.ru/na/tech_knigi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-lopatnov-informational?style=social&logo=linkedin)](https://www.linkedin.com/in/lopatnov/)

[![Build Status](https://travis-ci.org/lopatnov/jsToString.png?branch=master)](https://travis-ci.org/lopatnov/jsToString)

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

## Rights and Agreements

License [Apache-2.0](https://github.com/lopatnov/jsToString/blob/master/LICENSE)

Copyright 2019–2021 Oleksandr Lopatnov
