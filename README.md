# JavaScriptToString

JavaScript value to string runtime converter. It converts a runtime value into string a value.

# Install

Node:

```
npm i javascripttostring
```

Browser:

```
<script src="<path to library>/javascripttostring.umd.js"></script>
```

## Import package to the project

```
import javaScriptToString from 'javascripttostring';
```

## Convert JavaScript values into string values

**javaScriptToString(value: any, options?: IJ2SOptions) => string**

where

```
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

```
let myStringOfString = javaScriptToString('Hello world');
console.log(myStringOfString);
/* expected myStringOfString value: "\"Hello world\"" */
```

```
let myStringOfArray = javaScriptToString(["Hello", "World", ".", "How", "do", "you", "do", "?"]);
console.log(myStringOfArray);
/* expected myStringOfArray value: "[\"Hello\",\"World\",\".\",\"How\",\"do\",\"you\",\"do\",\"?\"]" */
```

```
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

```
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

```
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

# Rights and Agreements

License [Apache-2.0](https://github.com/lopatnov/jsToString/blob/master/LICENSE)

Copyright 2019 Oleksandr Lopatnov
