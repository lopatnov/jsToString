# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-02-13

### Added

- Cross-reference support: shared objects between different branches are now preserved as references
- Biome for linting and formatting (replaced JSHint)
- Jest coverage reporting enabled
- 23 new tests for circular and cross-reference scenarios (76 total)

### Fixed

- **Issue #1:** Circular references to parent elements at the top level are now resolved correctly
- Circular chain references (A -> B -> C -> A) now work at any depth

### Changed

- Updated all dependencies to latest versions
- Migrated from `rollup-plugin-*` to `@rollup/plugin-*` official packages
- Migrated CI from Node.js 12.x to Node.js 18/20/22
- Updated `@lopatnov/rollup-plugin-uglify` from 2.x to 3.x
- Upgraded TypeScript to 5.8, Jest to 30, Rollup to 4, Biome to 2.x
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
