# JavaScriptToString

JavaScript value to string converter. It converts a runtime value into string value.

## Import package to the project

```
import javaScriptToString from 'javascripttostring';
```

## Convert JavaScript values into string values

```
let myStringOfString = javaScriptToString('Hello world');

let myStringOfArray = javaScriptToString(["Hello", "World", ".", "How", "do", "you", "do", "?"]);

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
```

# Rights and Agreements

License [Apache-2.0](https://github.com/lopatnov/jsToString/blob/master/LICENSE)

Copyright 2019 Oleksandr Lopatnov