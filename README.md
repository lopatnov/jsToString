# @lopatnov/javascripttostring

[![npm](https://img.shields.io/npm/dt/@lopatnov/javascripttostring)](https://www.npmjs.com/package/@lopatnov/javascripttostring)
[![NPM version](https://badge.fury.io/js/%40lopatnov%2Fjavascripttostring.svg)](https://www.npmjs.com/package/@lopatnov/javascripttostring)
[![License](https://img.shields.io/github/license/lopatnov/jsToString)](https://github.com/lopatnov/jsToString/blob/master/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![GitHub stars](https://img.shields.io/github/stars/lopatnov/jsToString)](https://github.com/lopatnov/jsToString/stargazers)

A TypeScript library that converts any JavaScript runtime value into its string source code representation. Supports objects, arrays, functions, circular references, cross-references, and more.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Examples](#examples)
- [Supported Types](#supported-types)
- [Demo](#demo)
- [Documentation](#documentation)
- [Related Packages](#related-packages)
- [Contributing](#contributing)
- [Built With](#built-with)
- [License](#license)

## Installation

```bash
npm install @lopatnov/javascripttostring
```

### Browser (CDN)

```html
<script src="https://unpkg.com/@lopatnov/javascripttostring/dist/javascripttostring.umd.js"></script>
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
| `throwOnNonSerializable` | `boolean` | `false` | Throw an error for non-serializable values (Promise, Generator, WeakRef, WeakMap, WeakSet, FinalizationRegistry) |

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
// '(function(){ var ___ref1 = [null, 2, 3]; ___ref1[0] = ___ref1; return ___ref1; }())'
```

### Cross-References

Objects shared between different branches are preserved as references:

```typescript
var shared = { value: 42 };
var obj = { a: shared, b: shared };

javaScriptToString(obj);
// Generates code where obj.a === obj.b (same reference):
// (function(){ var ___ref1 = {
//   a: { value: 42 },
//   b: null
// }; ___ref1.b = ___ref1.a; return ___ref1; }())
```

### Using with Web Workers

Combine with [@lopatnov/worker-from-string](https://www.npmjs.com/package/@lopatnov/worker-from-string) to serialize functions and data for execution in a Web Worker:

```typescript
import javaScriptToString from "@lopatnov/javascripttostring";
import workerFromString from "@lopatnov/worker-from-string";

// Function with attached lookup data
function classify(value) {
  const range = classify.ranges.find(r => value >= r.min && value < r.max);
  return range ? range.label : "unknown";
}
classify.ranges = [
  { min: 0, max: 30, label: "cold" },
  { min: 30, max: 60, label: "warm" },
  { min: 60, max: 100, label: "hot" },
];

// Serialize and send to a worker
// javaScriptToString preserves the function AND its properties:
const code = javaScriptToString(classify);

const worker = workerFromString(`
  const classify = ${code};
  self.onmessage = (e) => postMessage(classify(e.data));
`);

worker.onmessage = (e) => console.log(e.data);
worker.postMessage(45); // "warm"
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

| Type | Example | Notes |
|------|---------|-------|
| Primitives | `string`, `number`, `boolean`, `undefined`, `null` | Including `-0` and `NaN` |
| BigInt | `BigInt(123)` | |
| Symbol | `Symbol("desc")`, `Symbol.for("key")` | Registry symbols preserved |
| RegExp | `/pattern/gi` | `lastIndex` preserved when non-zero |
| Date | `new Date("...")` | Invalid dates → `new Date(NaN)` |
| Error | `new Error()`, `new TypeError()` | TypeError, RangeError, ReferenceError, SyntaxError, URIError, EvalError |
| Array | `[1, 2, 3]` | Sparse arrays preserved |
| Object | `{ key: "value" }` | Including `Object.create(null)` |
| Function | `function() {}`, `() => {}`, `async function() {}` | Properties and prototype included |
| Generator Function | `function*() {}`, `async function*() {}` | |
| Map | `new Map([["key", "value"]])` | |
| Set | `new Set([1, 2, 3])` | |
| TypedArray | `Int8Array`, `Float64Array`, etc. | |
| ArrayBuffer | `new ArrayBuffer(8)`, `SharedArrayBuffer` | |
| DataView | `new DataView(buffer)` | |

### Non-serializable Types

The following types cannot be serialized and return `"undefined"` by default. Use `throwOnNonSerializable: true` to throw an error instead:

`Promise`, `Generator`, `WeakRef`, `WeakMap`, `WeakSet`, `FinalizationRegistry`

## Demo

Try the library interactively:

- [Interactive Demo](./demo/index.html)
- [RunKit Playground](https://npm.runkit.com/%40lopatnov%2Fjavascripttostring)

## Documentation

- [API Reference](./docs/index.html)
- [Changelog](./CHANGELOG.md)

## Related Packages

| Package | Description |
|---|---|
| [@lopatnov/worker-from-string](https://www.npmjs.com/package/@lopatnov/worker-from-string) | Create Web Workers from strings — pairs well with `javaScriptToString` |
| [@lopatnov/get-internal-type](https://www.npmjs.com/package/@lopatnov/get-internal-type) | Runtime type detection used internally by this library |

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

- Bug reports → [open an issue](https://github.com/lopatnov/jsToString/issues)
- Found it useful? A [star on GitHub](https://github.com/lopatnov/jsToString) helps others discover the project

---

## Built With

- [TypeScript](https://www.typescriptlang.org/) — strict typing throughout
- [Rollup](https://rollupjs.org/) — bundled to ESM, CJS, and UMD formats
- [Biome](https://biomejs.dev/) — linting and formatting
- [Vitest](https://vitest.dev/) — unit testing
- [TypeDoc](https://typedoc.org/) — API documentation generation
- [@lopatnov/get-internal-type](https://github.com/lopatnov/get-internal-type) — reliable runtime type detection

---

## License

[Apache-2.0](https://github.com/lopatnov/jsToString/blob/master/LICENSE) © 2019–2026 [Oleksandr Lopatnov](https://github.com/lopatnov) · [LinkedIn](https://www.linkedin.com/in/lopatnov/)
