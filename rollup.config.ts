import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import camelCase from 'lodash.camelcase';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import uglify from "@lopatnov/rollup-plugin-uglify";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const libraryName = 'JavaScriptToString';

export default {
  input: `src/${libraryName.toLowerCase()}.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
    ...Object.keys(pkg.peerDependencies || {})
  ],
  watch: {
    include: 'src/**/*',
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({
      tsconfig: './tsconfig.json',
      // Override tsconfig settings for rollup bundling
      declaration: false,
      declarationDir: undefined,
      outDir: undefined
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),
    uglify({
      sourceMap: true
    }),
  ],
};
