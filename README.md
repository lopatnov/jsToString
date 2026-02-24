# @lopatnov/javascripttostring

> JavaScript runtime value to string converter.
> Converts any JavaScript value — including functions, objects with circular references, and class instances — into its source-code string representation.

[![npm downloads](https://img.shields.io/npm/dt/@lopatnov/javascripttostring)](https://www.npmjs.com/package/@lopatnov/javascripttostring)
[![npm version](https://badge.fury.io/js/%40lopatnov%2Fjavascripttostring.svg)](https://www.npmjs.com/package/@lopatnov/javascripttostring)
[![License](https://img.shields.io/github/license/lopatnov/jsToString)](https://github.com/lopatnov/jsToString/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/lopatnov/jsToString)](https://github.com/lopatnov/jsToString/issues)
[![GitHub stars](https://img.shields.io/github/stars/lopatnov/jsToString)](https://github.com/lopatnov/jsToString/stargazers)

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Examples](#examples)
- [Demo](#demo)
- [Contributing](#contributing)
- [Built With](#built-with)
- [License](#license)

---

## Installation

```shell
npm install @lopatnov/javascripttostring
```

**Browser:**

```html
<script src="//lopatnov.github.io/jsToString/dist/javascripttostring.umd.js"></script>
```

---

## Usage

### TypeScript / ES Modules

```typescript
import javaScriptToString from '@lopatnov/javascripttostring';
```

### CommonJS

```javascript
const javaScriptToString = require("@lopatnov/javascripttostring");
```

---

## API

```typescript
javaScriptToString(value: any, options?: IJ2SOptions): string
```

### Options

```typescript
interface IJ2SOptions {
  includeFunctionProperties?: boolean; // default true
  includeFunctionPrototype?: boolean;  // default true
  includeBuffers?: boolean;            // default true
  nestedObjectsAmount?: number;        // default Number.POSITIVE_INFINITY
  nestedArraysAmount?: number;         // default Number.POSITIVE_INFINITY
  nestedFunctionsAmount?: number;      // default Number.POSITIVE_INFINITY
}
```

---

## Examples

### Strings and Arrays

```typescript
let myStringOfString = javaScriptToString('Hello world');
console.log(myStringOfString);
// "\"Hello world\""

let myStringOfArray = javaScriptToString(["Hello", "World", ".", "How", "do", "you", "do", "?"]);
console.log(myStringOfArray);
// "[\"Hello\",\"World\",\".\",\"How\",\"do\",\"you\",\"do\",\"?\"]"
```

### Objects

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
```

### Functions

```typescript
let myFunctionString = javaScriptToString(function(a, b) {
  console.log("Just a function");
});
console.log(myFunctionString);
// "function(a,b) {\n  console.log(\"Just a function\");\n}"
```

### Constructor Functions with Prototype

```typescript
function Simple(title) {
  this.title = title || "world";
}

Simple.count = 0;

Simple.prototype.show = function() {
  Simple.count++;
  console.log('title = ', this.title);
  console.log('count = ', Simple.count);
};

console.log(javaScriptToString(Simple));
// "(function(){ var Simple = function Simple(title) { ... }; ... return Simple; }())"
```

### Circular References

```javascript
var x = [1, 2, 3];
x[0] = x;
console.log(javaScriptToString(x));
// "(function(){ var ___j2s_0 = [null, 2, 3]; ___j2s_0['0'] = ___j2s_0;  return ___j2s_0; }())"
```

---

## Demo

- [RunKit demo](https://runkit.com/lopatnov/javascripttostring-demo)
- [npm.runkit.com](https://npm.runkit.com/%40lopatnov%2Fjavascripttostring)

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

- Bug reports → [open an issue](https://github.com/lopatnov/jsToString/issues)
- Found it useful? A [star on GitHub](https://github.com/lopatnov/jsToString) helps others discover the project

---

## Built With

- [TypeScript](https://www.typescriptlang.org/) — strict typing throughout
- [Rollup](https://rollupjs.org/) — bundled to ESM, CJS, and UMD formats
- [Jest](https://jestjs.io/) — unit testing
- [@lopatnov/get-internal-type](https://github.com/lopatnov/get-internal-type) — reliable runtime type detection

---

## License

[Apache-2.0](https://github.com/lopatnov/jsToString/blob/master/LICENSE) © 2019–2026 [Oleksandr Lopatnov](https://github.com/lopatnov) · [LinkedIn](https://www.linkedin.com/in/lopatnov/)
