# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2026-02-24

### Added

- Table of Contents added to README

### Changed

- Migrated from Jest + ts-jest to Vitest — native ESM, native TypeScript, no transform workarounds
- Removed `jest`, `jest-config`, `ts-jest`, `@types/jest` dependencies
- `jest.config.js` replaced with `vitest.config.js`
- Test files converted from `.cjs` to `.ts`
- Updated `@lopatnov/get-internal-type` to 2.2.1
- Updated `@lopatnov/rollup-plugin-uglify` to 4.1.3

## [2.0.0] - 2026-02-14

### Added

- Cross-reference support: shared objects between different branches are now preserved as references
- `throwOnNonSerializable` option: throws an error for non-serializable values instead of returning `"undefined"`
- Explicit handling for non-serializable types: `Promise`, `Generator`, `WeakRef`, `WeakMap`, `WeakSet`, `FinalizationRegistry`
- Negative zero (`-0`) preserved correctly
- Sparse arrays preserved (holes are not filled with `undefined`)
- `Symbol.for()` registry symbols distinguished from regular symbols
- `Symbol("")` (empty description) distinguished from `Symbol()` (no description)
- RegExp `lastIndex` preserved when non-zero
- Error subclasses preserved: `TypeError`, `RangeError`, `ReferenceError`, `SyntaxError`, `URIError`, `EvalError`
- `Object.create(null)` objects supported
- Async functions and async generator functions supported
- `SharedArrayBuffer` supported (grouped with `ArrayBuffer`)
- ESM (`.mjs`) and CJS (`.cjs`) dual-package support via `exports` field
- UMD build for browsers
- `"type": "module"` in package.json
- Biome for linting and formatting (replaced JSHint)
- Jest coverage reporting enabled
- 191 tests total (up from 53)

### Fixed

- **Issue #1:** Circular references to parent elements at the top level are now resolved correctly
- Circular chain references (A -> B -> C -> A) now work at any depth
- `counter = counter++` post-increment bug in cross-reference actions (value never incremented)
- `Object.prototype.hasOwnProperty.call()` used instead of `value.hasOwnProperty()` to support null-prototype objects
- Non-identifier property names in function properties now use bracket notation (`fn["my-prop"]` instead of invalid `fn.my-prop`)
- Non-identifier property names in object literals are now quoted
- Invalid `Date` objects now serialize as `new Date(NaN)` instead of `new Date("null")`
- Date strings are now quoted in output

### Changed

- Cross-reference output uses dot notation when possible (`___ref1.prop` instead of `___ref1['prop']`)
- Internal IIFE variable renamed from `___j2s_` to `___ref` for readability
- Updated `@lopatnov/get-internal-type` to 2.0.0
- Updated all dependencies to latest versions
- Migrated from `rollup-plugin-*` to `@rollup/plugin-*` official packages
- Migrated CI from Node.js 12.x to Node.js 18/20/22/24
- Updated `@lopatnov/rollup-plugin-uglify` from 2.x to 3.x
- Upgraded TypeScript to 5.8, Jest to 30, Rollup to 4, Biome to 2.x
- tsconfig lib updated to ES2022
- Minimum Node.js version is now 18.0.0

### Removed

- Travis CI configuration (replaced by GitHub Actions)
- JSHint configuration (replaced by Biome)
- `rollup-plugin-sourcemaps` (deprecated, no longer needed)

## [1.7.3] - 2022

### Changed

- Updated terser dependency

## [1.7.0 - 1.7.2]

### Changed

- Updated packages and dependencies

## [1.5.0 - 1.6.0]

### Added

- Options for limiting nesting depth (`nestedObjectsAmount`, `nestedArraysAmount`, `nestedFunctionsAmount`)

## [1.3.0 - 1.4.0]

### Added

- Support for Map, Set, TypedArray, ArrayBuffer, DataView
- Support for BigInt, Symbol

## [1.0.0 - 1.2.0]

### Added

- Initial release with `javaScriptToString` function
- Support for primitives, objects, arrays, functions, Date, RegExp, Error
- Circular reference handling
- Function properties and prototype serialization

See [GitHub releases](https://github.com/lopatnov/jsToString/releases) for more details.
