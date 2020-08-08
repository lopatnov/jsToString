import j2s from "../src/javascripttostring";

describe("Null to String", () => {
  it("should convert null to string", () => {
    let actual = j2s(null);
    let expected = "null";

    expect(actual).toBe(expected);
  });
  it("should convert undefined to string", () => {
    let actual = j2s(undefined);
    let expected = "undefined";

    expect(actual).toBe(expected);
  });
});

describe("Boolean to String", () => {
  it("should convert true", () => {
    let actual = j2s(true);
    let expected = "true";

    expect(actual).toBe(expected);
  });
  it("should convert false", () => {
    let actual = j2s(false);
    let expected = "false";

    expect(actual).toBe(expected);
  });
  it("should convert boolean object", () => {
    let actual = j2s(new Boolean(1000));
    let expected = "true";

    expect(actual).toBe(expected);
  });
});

describe("Number to String", () => {
  it("should convert 0", () => {
    let actual = j2s(0);
    let expected = "0";

    expect(actual).toBe(expected);
  });
  it("should convert numbers 0 < N < 1", () => {
    let actual = j2s(0.75);
    let expected = "0.75";

    expect(actual).toBe(expected);
  });
  it("should convert negative numbers", () => {
    let actual = j2s(-123);
    let expected = "-123";

    expect(actual).toBe(expected);
  });
  it("should convert positive numbers", () => {
    let actual = j2s(456);
    let expected = "456";

    expect(actual).toBe(expected);
  });
  it("should convert infinity", () => {
    let actual1 = j2s(Number.POSITIVE_INFINITY);
    let expected1 = "Number.POSITIVE_INFINITY";
    let actual2 = j2s(Number.NEGATIVE_INFINITY);
    let expected2 = "Number.NEGATIVE_INFINITY";

    expect(actual1).toBe(expected1);
    expect(actual2).toBe(expected2);
  });
  it("should convert min/max values", () => {
    let actual1 = j2s(Number.MAX_VALUE);
    let expected1 = "Number.MAX_VALUE";
    let actual2 = j2s(Number.MIN_VALUE);
    let expected2 = "Number.MIN_VALUE";

    expect(actual1).toBe(expected1);
    expect(actual2).toBe(expected2);
  });
  it("should convert BigInt numbers", () => {
    let actual = j2s(BigInt(9007199254740991));
    let expected = "BigInt(9007199254740991)";

    expect(actual).toBe(expected);
  });
});

describe("Symbol to String", () => {
  it("should convert empty Symbol", () => {
    let actual = j2s(Symbol());
    let expected = "Symbol()";

    expect(actual).toBe(expected);
  });
  it("should convert Symbol with description", () => {
    let actual = j2s(Symbol("Hello"));
    let expected = 'Symbol("Hello")';

    expect(actual).toBe(expected);
  });
  it("should convert built-in symbols", () => {
    expect(j2s(Symbol.iterator)).toBe("Symbol.iterator");
    expect(j2s(Symbol.asyncIterator)).toBe("Symbol.asyncIterator");
    expect(j2s(Symbol.hasInstance)).toBe("Symbol.hasInstance");
  });
});

describe("String to String", () => {
  it("should convert empty string", () => {
    let actual = j2s("");
    let expected = '""';

    expect(actual).toBe(expected);
  });
  it("should convert a string", () => {
    let actual = j2s(
      "JavaScript value to string converter. It converts a runtime value into string value."
    );
    let expected =
      '"JavaScript value to string converter. It converts a runtime value into string value."';

    expect(actual).toBe(expected);
  });
  it("should convert special symbols", () => {
    let actual = j2s("Check symbols: '\"\t\n—“”⚡");
    let expected = '"Check symbols: \'\\"\\t\\n—“”⚡"';

    expect(actual).toBe(expected);
  });
});

describe("RegExp to String", () => {
  it("should convert RegExp", () => {
    let actual = j2s(/s+/gi);
    let expected = "/s+/gi";

    expect(actual).toBe(expected);
  });
});

describe("Error to String", () => {
  it("should convert Error", () => {
    let actual = j2s(new Error("A mistake"));
    let expected = 'new Error("A mistake", undefined, undefined)';

    expect(actual).toBe(expected);
  });
});

describe("Array to String", () => {
  it("should convert empty Array", () => {
    let actual = j2s([]);
    let expected = "[]";

    expect(actual).toBe(expected);
  });
  it("should convert an Array", () => {
    let arr = [1, 2, 3, "hello", "world"];
    let actual = j2s(arr);
    let expected = '[1, 2, 3, "hello", "world"]';

    expect(actual).toBe(expected);
    expect(arr[0]).toBe(1);
    expect(arr[1]).toBe(2);
  });
  it("should convert a typed Array", () => {
    let arr = new Int8Array([1, 2, 3]);
    let str = j2s(arr);
    let actual = Function(`return ${str};`)();

    expect(arr[0]).toBe(1);
    expect(arr[1]).toBe(2);
    expect(actual instanceof Int8Array).toBeTruthy();
    expect(actual[0]).toBe(1);
    expect(actual[1]).toBe(2);
    expect(actual[2]).toBe(3);
  });
  it("should convert with nestedArraysAmount = 0", () => {
    let str = j2s([1,2,3,[4,5,6, [7,8,9]]], {
      nestedArraysAmount: 0
    });
    let actual = Function(`return ${str};`)();

    expect(actual[2]).toBe(3);
    expect(actual[3]).not.toBeDefined();
  });
  it("should convert with nestedArraysAmount = 1", () => {
    let str = j2s([1,2,3,[4,5,6, [7,8,9]]], {
      nestedArraysAmount: 1
    });
    let actual = Function(`return ${str};`)();

    expect(actual[2]).toBe(3);
    expect(actual[3]).toBeDefined();
    expect(actual[3][0]).toBe(4);
    expect(actual[3][3]).not.toBeDefined();
  });
});

describe("Function to String", () => {
  it("should convert an anonymous function", () => {
    let stringFunction = j2s(function(a: any, b: any, c: any) {
      return a + b + c;
    });
    let actual = Function("return " + stringFunction)();
    let expected = 6;

    expect(actual(1, 2, 3)).toBe(expected);
  });
  it("should convert an named function", () => {
    function sum(...numbers: number[]) {
      return Array.prototype.reduce.call(
        numbers,
        (accumulator: any, currentValue: any) => {
          return accumulator + currentValue;
        },
        0
      );
    }

    let stringFunction = j2s(sum);
    let actual = Function("return " + stringFunction)();
    let expected = 10;

    expect(actual(1, 2, 3, 4)).toBe(expected);
  });
  it("should convert lambda function", () => {
    let stringFunction = j2s((a: any, b: any) => {
      return a * b;
    });
    let actual = Function("return " + stringFunction)();
    let expected = 12;

    expect(actual(3, 4)).toBe(expected);
  });
  it("should convert class", () => {
    let stringFunction = j2s(
      class TestClass {
        public TestVariable: string;
        constructor() {
          this.TestVariable = "Hello Test";
        }
      }
    );
    let actualClass = Function("return " + stringFunction)();
    let actualObject = new actualClass();
    let expected = "Hello Test";

    expect(actualObject.TestVariable).toBe(expected);
  });
  it("should work with function prototype", () => {
    class TestClass {
      public TestVariable: string;
      constructor() {
        this.TestVariable = "Hello Test";
      }

      public TestMethod(): string {
        return "It Works";
      }
    }

    let stringFunction = j2s(TestClass);
    let actualClass = Function("return " + stringFunction)();
    let actualObject = new actualClass();
    let expected = "It Works";

    expect(actualObject.TestMethod()).toBe(expected);
  });
  it("should work with includeFunctionProperties = false & includeFunctionPrototype = false", () => {
    function TestConstructor() {}
    (TestConstructor as any).Test1 = "Completed";
    TestConstructor.prototype.testMethod = function() {
      return "It works";
    };

    let stringFunction = j2s(TestConstructor, {
      includeFunctionProperties: false,
      includeFunctionPrototype: false
    });
    let actualClass = Function("return " + stringFunction)();

    expect(actualClass.name).toBe("TestConstructor");
    expect(actualClass.Test1).not.toBeDefined();
    expect(actualClass.prototype.testMethod).not.toBeDefined();
  });
  it("should work with includeFunctionProperties = false", () => {
    function TestConstructor() {}
    (TestConstructor as any).Test1 = "Completed";
    TestConstructor.prototype.testMethod = function() {
      return "It works";
    };
    TestConstructor.prototype.testMethod.subTestMethod = function() {
      return "It not works";
    };
    TestConstructor.prototype.testMethod.prototype.subTestMethod = function() {
      return "It works too";
    };

    let stringFunction = j2s(TestConstructor, {
      includeFunctionProperties: false
    });
    let actualClass = Function("return " + stringFunction)();

    expect(actualClass.name).toBe("TestConstructor");
    expect(actualClass.Test1).not.toBeDefined();
    expect(actualClass.prototype.testMethod()).toBe("It works");
    expect(actualClass.prototype.testMethod.subTestMethod).not.toBeDefined();
    expect(actualClass.prototype.testMethod.prototype.subTestMethod()).toBe("It works too");
  });
  it("should work with includeFunctionPrototype = false", () => {
    function TestConstructor() {}
    (TestConstructor as any).Test1 = "Completed";
    TestConstructor.prototype.testMethod = function() {
      return "It works";
    };

    let stringFunction = j2s(TestConstructor, {
      includeFunctionPrototype: false
    });
    let actualClass = Function("return " + stringFunction)();

    expect(actualClass.name).toBe("TestConstructor");
    expect(actualClass.Test1).toBe("Completed");
    expect(actualClass.prototype.testMethod).not.toBeDefined();
  });
  it("should work with nestedFunctionsAmount = 0", () => {
    function TestConstructor() {}
    (TestConstructor as any).Test1 = "Completed";
    TestConstructor.prototype.testMethod = function() {
      return "It works";
    };

    let stringFunction = j2s(TestConstructor, {
      nestedFunctionsAmount: 0
    });
    let actualClass = Function("return " + stringFunction)();

    expect(actualClass.name).toBe("TestConstructor");
    expect(actualClass.Test1).toBe("Completed");
    expect(actualClass.prototype.testMethod).not.toBeDefined();
  });
  it("should work with nestedFunctionsAmount = 1", () => {
    function TestConstructor() {}
    (TestConstructor as any).Test1 = "Completed";
    TestConstructor.prototype.testMethod = function() {
      return "It works";
    };
    TestConstructor.prototype.testMethod.subTestMethod = function() {
      return "It works too";
    };

    let stringFunction = j2s(TestConstructor, {
      nestedFunctionsAmount: 1
    });
    let actualClass = Function("return " + stringFunction)();

    expect(actualClass.name).toBe("TestConstructor");
    expect(actualClass.Test1).toBe("Completed");
    expect(actualClass.prototype.testMethod()).toBe("It works");
    expect(actualClass.prototype.testMethod.subTestMethod).not.toBeDefined();
  });
});

describe("Object to String", () => {
  it("should convert empty Object", () => {
    let actual = j2s({});
    let expected = "{}";

    expect(actual).toBe(expected);
  });
  it("should convert an Object", () => {
    let stringObject = j2s({
      a: 1,
      hello: "world",
      innerObject: {
        testFunction: (x1: number, y1: number, x2: number, y2: number) => {
          return Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5);
        }
      }
    });
    let actual = Function("return " + stringObject)();
    let expected1 = 1;
    let expected2 = "world";
    let expected3 = 5;

    expect(actual.a).toBe(expected1);
    expect(actual.hello).toBe(expected2);
    expect(actual.innerObject).toBeDefined();
    expect(actual.innerObject.testFunction(3, 0, 0, 4)).toBe(expected3);
  });
  it("should work with nestedObjectsAmount = 0", () => {
    let objectString = j2s({
      a: "hello",
      b: true,
      c: {
        d: "world"
      }
    }, {
      nestedObjectsAmount: 0
    });
    let actual = Function(`return ${objectString};`)();

    expect(actual.a).toBe("hello");
    expect(actual.b).toBe(true);
    expect(actual.c).not.toBeDefined();
  });
  it("should work with nestedObjectsAmount = 1", () => {
    let objectString = j2s({
      a: "hello",
      b: true,
      c: {
        d: {
          e: {
            f: 'world'
          },
          g: 123
        },
        j: () => 'ok'
      }
    }, {
      nestedObjectsAmount: 1
    });
    let actual = Function(`return ${objectString};`)();

    expect(actual.a).toBe("hello");
    expect(actual.b).toBe(true);
    expect(actual.c).toBeDefined();
    expect(actual.c.d).not.toBeDefined();
    expect(actual.c.j).toBeDefined();
    expect(actual.c.j()).toBe('ok');
  });
  it("should work with nestedObjectsAmount = 2", () => {
    let objectString = j2s({
      a: "hello",
      b: true,
      c: {
        d: {
          e: {
            f: 'world'
          },
          g: 123
        },
        j: () => 'ok'
      }
    }, {
      nestedObjectsAmount: 2
    });
    let actual = Function(`return ${objectString};`)();

    expect(actual.a).toBe("hello");
    expect(actual.b).toBe(true);
    expect(actual.c).toBeDefined();
    expect(actual.c.j).toBeDefined();
    expect(actual.c.j()).toBe('ok');
    expect(actual.c.d.e).not.toBeDefined();
    expect(actual.c.d.g).toBe(123);
  });
});

describe("Set to String", () => {
  it("should convert the empty set", () => {
    let actual = j2s(new Set());
    let expected = "new Set()";

    expect(actual).toBe(expected);
  });
  it("should convert a set", () => {
    let actual = j2s(new Set([1, 2, 3]));
    let expected = "new Set([1, 2, 3])";

    expect(actual).toBe(expected);
  });
});

describe("Map to String", () => {
  it("should convert the empty map", () => {
    let actual = j2s(new Map());
    let expected = "new Map()";

    expect(actual).toBe(expected);
  });
  it("should convert a map", () => {
    let actual = j2s(new Map([[1, 2], [3, 4]]));
    let expected = "new Map([[1, 2], [3, 4]])";

    expect(actual).toBe(expected);
  });
});

describe("Resolve references to itself", () => {
  it("should resolve the array itself", () => {
    var x: any = [1,2,3];
    x[0] = x;

    let actual = j2s(x);
    let expected = Function(`return ${actual}`)();

    expect(expected[0]).toBe(expected);
    expect(expected[1]).toBe(2);
    expect(expected[2]).toBe(3);
    expect(expected.length).toBe(3);
  });

  it("should resolve the array inside arrays", () => {
    var x: any = [[4,5,[6,7,8]],22,33];
    x[0][2][1] = x;
    x[0][2][2] = x;

    let actual = j2s(x);
    let expected = Function(`return ${actual}`)();

    expect(expected[0][2][2]).toBe(expected);
    expect(expected[0][2][1]).toBe(expected);
    expect(expected[0][2][0]).toBe(6);
    expect(expected[1]).toBe(22);
    expect(expected[2]).toBe(33);
    expect(expected.length).toBe(3);
  });

  it("should resolve the object itself", () => {
    var x: any = { a: { b: {c: { hello: 'world' } } }};
    x.a.b.c.hello = x;

    let actual = j2s(x);
    let expected = Function(`return ${actual}`)();

    expect(expected).toBeTruthy();
    expect(expected.a).toBeTruthy();
    expect(expected.a.b).toBeTruthy();
    expect(expected.a.b.c).toBeTruthy();
    expect(expected.a.b.c.hello).toBe(expected);
  });

  it("should resolve objects and arrays", () => {
    const y: any[] = ['an', 'array', null];
    const x = {
      a: 123,
      b: 'an object',
      c: y
    };
    y[2] = x;
    const z = {
      arr: [x]
    };

    let actual = j2s(z);
    let expected = Function(`return ${actual}`)();

    expect(expected).toBeTruthy();
    expect(expected.arr[0].a).toBe(123);
    expect(expected.arr[0].b).toBe('an object');
    expect(Array.isArray(expected.arr[0].c)).toBeTruthy();
    expect(expected.arr[0].c[0]).toBe('an');
    expect(expected.arr[0].c[1]).toBe('array');
    expect(expected.arr[0].c[2].a).toBe(123);
    expect(expected.arr[0].c[2].c[2].a).toBe(123);
  });

  it("should resolve the function itself", () => {
    function Narcissus() {
      return 'narcissus';
    }
    Narcissus.itself = Narcissus;
    Narcissus.prototype.me = Narcissus;
    Narcissus.prototype.deep = {
      arr: [Narcissus]
    }

    let actual = j2s(Narcissus);
    let expected = Function(`return ${actual}`)();

    expect(expected instanceof Function).toBeTruthy();
    expect(expected()).toBe('narcissus');
    expect(expected.itself).toBe(expected);
    expect(expected.prototype.me).toBe(expected);
    expect(expected.prototype.deep.arr[0]).toBe(expected);
  });
});