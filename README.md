# @lopatnov/javascripttostring

[![npm](https://img.shields.io/npm/dt/@lopatnov/javascripttostring)](https://www.npmjs.com/package/@lopatnov/javascripttostring)
[![NPM version](https://badge.fury.io/js/%40lopatnov%2Fjavascripttostring.svg)](https://www.npmjs.com/package/@lopatnov/javascripttostring)
[![License](https://img.shields.io/github/license/lopatnov/jsToString)](https://github.com/lopatnov/jsToString/blob/master/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![GitHub stars](https://img.shields.io/github/stars/lopatnov/jsToString)](https://github.com/lopatnov/jsToString/stargazers)

A TypeScript library that converts any JavaScript runtime value into its string source code representation. Supports objects, arrays, functions, circular references, cross-references, and more.

## Features

- Full TypeScript support with type definitions
- Multiple output formats: CommonJS, ES Modules, UMD
- Handles circular references (self-referencing objects/arrays)
- Handles cross-references (shared objects between branches)
- Converts functions with their properties and prototypes
- Supports built-in types: Date, RegExp, Error, Map, Set, TypedArrays, Symbols, BigInt
- Configurable nesting depth for objects, arrays, and functions

## Installation

```bash
npm install @lopatnov/javascripttostring
```

### Browser (CDN)

```html
<!-- Development version -->
<script src="https://lopatnov.github.io/jsToString/dist/javascripttostring.umd.js"></script>
```

## Usage

### ES Modules

```typescript
import javaScriptToString from "@lopatnov/javascripttostring";
```

### CommonJS

```javascript
const javaScriptToString = require("@lopatnov/javascripttostring");
```

### Browser (UMD)

```javascript
const javaScriptToString = window.javaScriptToString;
```

## API

### javaScriptToString(value, options?): string

Converts a JavaScript value to its string source code representation.

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `any` | The value to convert |
| `options` | `IJ2SOptions` | Optional configuration |

**Returns:** `string` - Source code representation that can be evaluated back to the original value

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `includeFunctionProperties` | `boolean` | `true` | Include function's own properties |
| `includeFunctionPrototype` | `boolean` | `true` | Include function's prototype properties |
| `includeBuffers` | `boolean` | `true` | Include ArrayBuffer and TypedArray contents |
| `nestedObjectsAmount` | `number` | `Infinity` | Max depth for nested objects |
| `nestedArraysAmount` | `number` | `Infinity` | Max depth for nested arrays |
| `nestedFunctionsAmount` | `number` | `Infinity` | Max depth for nested functions |

## Examples

### Primitives

```typescript
javaScriptToString("Hello world");   // '"Hello world"'
javaScriptToString(42);              // '42'
javaScriptToString(true);            // 'true'
javaScriptToString(undefined);       // 'undefined'
javaScriptToString(null);            // 'null'
```

### Arrays

```typescript
javaScriptToString(["Hello", "World"]);
// '["Hello", "World"]'
```

### Objects

```typescript
javaScriptToString({
  name: "Alex",
  friends: ["Shurik", "Hola"],
  greet: () => {
    console.log("How you doing?");
  }
});
// '{name: "Alex", friends: ["Shurik", "Hola"], greet: () => { console.log("How you doing?"); }}'
```

### Functions with Properties

```typescript
function Simple(title) {
  this.title = title || "world";
}
Simple.count = 0;
Simple.prototype.show = function () {
  Simple.count++;
  console.log("title =", this.title);
};

javaScriptToString(Simple);
// '(function(){ var Simple = function Simple(title) { ... }; Simple.count = 0; Simple.prototype.show = function(){ ... }; return Simple; }())'
```

### Circular References

Objects that reference themselves are fully supported:

```typescript
var x = [1, 2, 3];
x[0] = x;

javaScriptToString(x);
// '(function(){ var ___j2s_0 = [null, 2, 3]; ___j2s_0['0'] = ___j2s_0; return ___j2s_0; }())'
```

### Cross-References

Objects shared between different branches are preserved as references:

```typescript
var shared = { value: 42 };
var obj = { a: shared, b: shared };

javaScriptToString(obj);
// Generates code where obj.a === obj.b (same reference)
```

### Restoring Values

The generated string can be evaluated back to a working JavaScript value:

```typescript
var original = { name: "test" };
original.self = original;

var code = javaScriptToString(original);
var restored = Function("return " + code)();

console.log(restored.self === restored); // true
console.log(restored.name);             // "test"
```

## Supported Types

| Type | Example |
|------|---------|
| Primitives | `string`, `number`, `boolean`, `undefined`, `null` |
| BigInt | `BigInt(123)` |
| Symbol | `Symbol("description")` |
| RegExp | `/pattern/gi` |
| Date | `new Date()` |
| Error | `new Error("message")` |
| Array | `[1, 2, 3]` |
| Object | `{ key: "value" }` |
| Function | `function() {}`, `() => {}` |
| Map | `new Map([["key", "value"]])` |
| Set | `new Set([1, 2, 3])` |
| TypedArray | `Int8Array`, `Float64Array`, etc. |
| ArrayBuffer | `new ArrayBuffer(8)` |
| DataView | `new DataView(buffer)` |

## Demo

- **Live Demo:** [https://runkit.com/lopatnov/javascripttostring-demo](https://runkit.com/lopatnov/javascripttostring-demo)
- **Try it:** [https://npm.runkit.com/@lopatnov/javascripttostring](https://npm.runkit.com/%40lopatnov%2Fjavascripttostring)

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[Apache-2.0](LICENSE)

Copyright 2019-2026 Oleksandr Lopatnov

---

### Author

**Oleksandr Lopatnov**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/lopatnov/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat&logo=github)](https://github.com/lopatnov)

If you find this project useful, please consider giving it a star on GitHub!
