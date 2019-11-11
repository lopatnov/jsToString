# JavaScriptToString

JavaScript value to string converter. It converts a runtime value into string a value.

# Install

```
npm i javascripttostring
```

## Import package to the project

```
import javaScriptToString from 'javascripttostring';
```

## Convert JavaScript values into string values

**javaScriptToString(value: any, options?: IJ2SOptions) => string // Converts JavaScript value (obj) to string**

where

```
interface IJ2SOptions {
  includeFunctionProperties?: boolean;
  includeFunctionPrototype?: boolean;
}
```

```
let myStringOfString = javaScriptToString('Hello world');
/* expected myStringOfString value: "\"Hello world\"" */

let myStringOfArray = javaScriptToString(["Hello", "World", ".", "How", "do", "you", "do", "?"]);
/* expected myStringOfArray value: "[\"Hello\",\"World\",\".\",\"How\",\"do\",\"you\",\"do\",\"?\"]" */

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
/* expected myObjectString value:
"{friend1: \"Shurik\",friend2: \"Alex\",friends: {friend3: 123456,friend4: {},friend5: [\"Hola\",\"amigo\"],friend6: () => {
            console.log(\"How you doing?\");
        }}}"
*/

let myFunctionString = javaScriptToString(function(a,b) {
  console.log("Just a function");
})
/* expected myFunctionString:
"function(a,b) {
  console.log(\"Just a function\");
}"
*/
```

# Rights and Agreements

License [Apache-2.0](https://github.com/lopatnov/jsToString/blob/master/LICENSE)

Copyright 2019 Oleksandr Lopatnov
