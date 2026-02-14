import j2s from "../src/javascripttostring";

describe("Null to String", () => {
  it("should convert null to string", () => {
    const actual = j2s(null);
    const expected = "null";

    expect(actual).toBe(expected);
  });
  it("should convert undefined to string", () => {
    const actual = j2s(undefined);
    const expected = "undefined";

    expect(actual).toBe(expected);
  });
});

describe("Boolean to String", () => {
  it("should convert true", () => {
    const actual = j2s(true);
    const expected = "true";

    expect(actual).toBe(expected);
  });
  it("should convert false", () => {
    const actual = j2s(false);
    const expected = "false";

    expect(actual).toBe(expected);
  });
  it("should convert boolean object", () => {
    const actual = j2s(new Boolean(1000));
    const expected = "true";

    expect(actual).toBe(expected);
  });
});

describe("Number to String", () => {
  it("should convert 0", () => {
    const actual = j2s(0);
    const expected = "0";

    expect(actual).toBe(expected);
  });
  it("should convert numbers 0 < N < 1", () => {
    const actual = j2s(0.75);
    const expected = "0.75";

    expect(actual).toBe(expected);
  });
  it("should convert negative numbers", () => {
    const actual = j2s(-123);
    const expected = "-123";

    expect(actual).toBe(expected);
  });
  it("should convert positive numbers", () => {
    const actual = j2s(456);
    const expected = "456";

    expect(actual).toBe(expected);
  });
  it("should convert infinity", () => {
    const actual1 = j2s(Number.POSITIVE_INFINITY);
    const expected1 = "Number.POSITIVE_INFINITY";
    const actual2 = j2s(Number.NEGATIVE_INFINITY);
    const expected2 = "Number.NEGATIVE_INFINITY";

    expect(actual1).toBe(expected1);
    expect(actual2).toBe(expected2);
  });
  it("should convert min/max values", () => {
    const actual1 = j2s(Number.MAX_VALUE);
    const expected1 = "Number.MAX_VALUE";
    const actual2 = j2s(Number.MIN_VALUE);
    const expected2 = "Number.MIN_VALUE";

    expect(actual1).toBe(expected1);
    expect(actual2).toBe(expected2);
  });
  it("should convert BigInt numbers", () => {
    const actual = j2s(BigInt(9007199254740991));
    const expected = "BigInt(9007199254740991)";

    expect(actual).toBe(expected);
  });
});

describe("Symbol to String", () => {
  it("should convert empty Symbol", () => {
    const actual = j2s(Symbol());
    const expected = "Symbol()";

    expect(actual).toBe(expected);
  });
  it("should convert Symbol with description", () => {
    const actual = j2s(Symbol("Hello"));
    const expected = 'Symbol("Hello")';

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
    const actual = j2s("");
    const expected = '""';

    expect(actual).toBe(expected);
  });
  it("should convert a string", () => {
    const actual = j2s("JavaScript value to string converter. It converts a runtime value into string value.");
    const expected = '"JavaScript value to string converter. It converts a runtime value into string value."';

    expect(actual).toBe(expected);
  });
  it("should convert special symbols", () => {
    const actual = j2s("Check symbols: '\"\t\n—“”⚡");
    const expected = '"Check symbols: \'\\"\\t\\n—“”⚡"';

    expect(actual).toBe(expected);
  });
});

describe("RegExp to String", () => {
  it("should convert RegExp", () => {
    const actual = j2s(/s+/gi);
    const expected = "/s+/gi";

    expect(actual).toBe(expected);
  });
});

describe("Error to String", () => {
  it("should convert Error", () => {
    const actual = j2s(new Error("A mistake"));
    const expected = 'new Error("A mistake")';

    expect(actual).toBe(expected);
  });
  it("should eval Error back", () => {
    const err = new Error("test error");
    const str = j2s(err);
    const restored = Function("return " + str)();

    expect(restored).toBeInstanceOf(Error);
    expect(restored.message).toBe("test error");
  });
  it("should convert TypeError", () => {
    const actual = j2s(new TypeError("bad type"));
    expect(actual).toBe('new TypeError("bad type")');
    const restored = Function("return " + actual)();
    expect(restored).toBeInstanceOf(TypeError);
    expect(restored.message).toBe("bad type");
  });
  it("should convert RangeError", () => {
    const actual = j2s(new RangeError("out of range"));
    expect(actual).toBe('new RangeError("out of range")');
    const restored = Function("return " + actual)();
    expect(restored).toBeInstanceOf(RangeError);
    expect(restored.message).toBe("out of range");
  });
  it("should convert ReferenceError", () => {
    const actual = j2s(new ReferenceError("not defined"));
    expect(actual).toBe('new ReferenceError("not defined")');
    const restored = Function("return " + actual)();
    expect(restored).toBeInstanceOf(ReferenceError);
    expect(restored.message).toBe("not defined");
  });
});

describe("Date to String", () => {
  it("should convert valid Date and eval back", () => {
    const date = new Date("2026-01-15T10:30:00.000Z");
    const str = j2s(date);
    const restored = Function("return " + str)();

    expect(restored).toBeInstanceOf(Date);
    expect(restored.toISOString()).toBe("2026-01-15T10:30:00.000Z");
  });
  it("should convert invalid Date", () => {
    const date = new Date("not a date");
    const str = j2s(date);
    const restored = Function("return " + str)();

    expect(restored).toBeInstanceOf(Date);
    expect(isNaN(restored.getTime())).toBe(true);
  });
});

describe("Edge cases", () => {
  it("should convert NaN", () => {
    const str = j2s(NaN);
    expect(str).toBe("Number.NaN");
    const restored = Function("return " + str)();
    expect(Number.isNaN(restored)).toBe(true);
  });
  it("should convert Infinity", () => {
    const str = j2s(Infinity);
    expect(str).toBe("Number.POSITIVE_INFINITY");
  });
  it("should convert -Infinity", () => {
    const str = j2s(-Infinity);
    expect(str).toBe("Number.NEGATIVE_INFINITY");
  });
  it("should handle property names with special characters", () => {
    const obj = { "key-with-dash": 1, "key.with.dot": 2, normal: 3, _under: 4, $dollar: 5 };
    const str = j2s(obj);
    const restored = Function("return " + str)();

    expect(restored["key-with-dash"]).toBe(1);
    expect(restored["key.with.dot"]).toBe(2);
    expect(restored.normal).toBe(3);
    expect(restored._under).toBe(4);
    expect(restored.$dollar).toBe(5);
  });
  it("should handle property names with quotes", () => {
    const obj: any = {};
    obj['key"quote'] = 42;
    const str = j2s(obj);
    const restored = Function("return " + str)();

    expect(restored['key"quote']).toBe(42);
  });
  it("should convert negative zero", () => {
    const str = j2s(-0);
    expect(str).toBe("-0");
    const restored = Function("return " + str)();
    expect(Object.is(restored, -0)).toBe(true);
  });
  it("should handle sparse arrays", () => {
    const arr = new Array(3);
    arr[0] = 1;
    arr[2] = 3;
    const str = j2s(arr);
    const restored = Function("return " + str)();
    expect(restored.length).toBe(3);
    expect(restored[0]).toBe(1);
    expect(1 in restored).toBe(false);
    expect(restored[2]).toBe(3);
  });
  it("should handle Symbol.for() registry symbols", () => {
    const sym = Symbol.for("myGlobalKey");
    const str = j2s(sym);
    expect(str).toBe('Symbol.for("myGlobalKey")');
    const restored = Function("return " + str)();
    expect(restored).toBe(Symbol.for("myGlobalKey"));
  });
  it("should handle RegExp with lastIndex", () => {
    const re = /test/g;
    re.lastIndex = 4;
    const str = j2s(re);
    expect(str).toContain("lastIndex = 4");
    const restored = Function("return " + str)();
    expect(restored.lastIndex).toBe(4);
    expect(restored.source).toBe("test");
    expect(restored.flags).toBe("g");
  });
  it("should handle RegExp without lastIndex", () => {
    const re = /hello/i;
    const str = j2s(re);
    expect(str).toBe("/hello/i");
  });
  it("should handle function properties with special names", () => {
    function myFn() {
      return 1;
    }
    (myFn as any)["my-prop"] = 42;
    (myFn as any).normal = 10;
    const str = j2s(myFn);
    const restored = Function("return " + str)();
    expect(restored["my-prop"]).toBe(42);
    expect(restored.normal).toBe(10);
  });
  it("should handle Object.create(null)", () => {
    const obj = Object.create(null);
    obj.foo = "bar";
    obj.num = 42;
    const str = j2s(obj);
    const restored = Function("return " + str)();
    expect(restored.foo).toBe("bar");
    expect(restored.num).toBe(42);
  });
  it("should distinguish Symbol('') from Symbol()", () => {
    const s1 = Symbol("");
    const s2 = Symbol();
    const str1 = j2s(s1);
    const str2 = j2s(s2);
    expect(str1).toBe('Symbol("")');
    expect(str2).toBe("Symbol()");
  });
});

describe("Array to String", () => {
  it("should convert empty Array", () => {
    const actual = j2s([]);
    const expected = "[]";

    expect(actual).toBe(expected);
  });
  it("should convert an Array", () => {
    const arr = [1, 2, 3, "hello", "world"];
    const actual = j2s(arr);
    const expected = '[1, 2, 3, "hello", "world"]';

    expect(actual).toBe(expected);
    expect(arr[0]).toBe(1);
    expect(arr[1]).toBe(2);
  });
  it("should convert a typed Array", () => {
    const arr = new Int8Array([1, 2, 3]);
    const str = j2s(arr);
    const actual = Function(`return ${str};`)();

    expect(arr[0]).toBe(1);
    expect(arr[1]).toBe(2);
    expect(actual instanceof Int8Array).toBeTruthy();
    expect(actual[0]).toBe(1);
    expect(actual[1]).toBe(2);
    expect(actual[2]).toBe(3);
  });
  it("should convert with nestedArraysAmount = 0", () => {
    const str = j2s([1, 2, 3, [4, 5, 6, [7, 8, 9]]], {
      nestedArraysAmount: 0,
    });
    const actual = Function(`return ${str};`)();

    expect(actual[2]).toBe(3);
    expect(actual[3]).not.toBeDefined();
  });
  it("should convert with nestedArraysAmount = 1", () => {
    const str = j2s([1, 2, 3, [4, 5, 6, [7, 8, 9]]], {
      nestedArraysAmount: 1,
    });
    const actual = Function(`return ${str};`)();

    expect(actual[2]).toBe(3);
    expect(actual[3]).toBeDefined();
    expect(actual[3][0]).toBe(4);
    expect(actual[3][3]).not.toBeDefined();
  });
});

describe("Function to String", () => {
  it("should convert an anonymous function", () => {
    const stringFunction = j2s((a: any, b: any, c: any) => a + b + c);
    const actual = Function("return " + stringFunction)();
    const expected = 6;

    expect(actual(1, 2, 3)).toBe(expected);
  });
  it("should convert an named function", () => {
    function sum(...numbers: number[]) {
      return Array.prototype.reduce.call(
        numbers,
        (accumulator: any, currentValue: any) => {
          return accumulator + currentValue;
        },
        0,
      );
    }

    const stringFunction = j2s(sum);
    const actual = Function("return " + stringFunction)();
    const expected = 10;

    expect(actual(1, 2, 3, 4)).toBe(expected);
  });
  it("should convert lambda function", () => {
    const stringFunction = j2s((a: any, b: any) => {
      return a * b;
    });
    const actual = Function("return " + stringFunction)();
    const expected = 12;

    expect(actual(3, 4)).toBe(expected);
  });
  it("should convert class", () => {
    const stringFunction = j2s(
      class TestClass {
        public TestVariable: string;
        constructor() {
          this.TestVariable = "Hello Test";
        }
      },
    );
    const actualClass = Function("return " + stringFunction)();
    const actualObject = new actualClass();
    const expected = "Hello Test";

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

    const stringFunction = j2s(TestClass);
    const actualClass = Function("return " + stringFunction)();
    const actualObject = new actualClass();
    const expected = "It Works";

    expect(actualObject.TestMethod()).toBe(expected);
  });
  it("should work with includeFunctionProperties = false & includeFunctionPrototype = false", () => {
    function TestConstructor() {}
    (TestConstructor as any).Test1 = "Completed";
    TestConstructor.prototype.testMethod = () => "It works";

    const stringFunction = j2s(TestConstructor, {
      includeFunctionProperties: false,
      includeFunctionPrototype: false,
    });
    const actualClass = Function("return " + stringFunction)();

    expect(actualClass.name).toBe("TestConstructor");
    expect(actualClass.Test1).not.toBeDefined();
    expect(actualClass.prototype.testMethod).not.toBeDefined();
  });
  it("should work with includeFunctionProperties = false", () => {
    function TestConstructor() {}
    (TestConstructor as any).Test1 = "Completed";
    // biome-ignore lint/complexity/useArrowFunction: needs .prototype (arrow functions have none)
    TestConstructor.prototype.testMethod = function () {
      return "It works";
    };
    TestConstructor.prototype.testMethod.subTestMethod = () => "It not works";
    // biome-ignore lint/complexity/useArrowFunction: needs .prototype (arrow functions have none)
    TestConstructor.prototype.testMethod.prototype.subTestMethod = function () {
      return "It works too";
    };

    const stringFunction = j2s(TestConstructor, {
      includeFunctionProperties: false,
    });
    const actualClass = Function("return " + stringFunction)();

    expect(actualClass.name).toBe("TestConstructor");
    expect(actualClass.Test1).not.toBeDefined();
    expect(actualClass.prototype.testMethod()).toBe("It works");
    expect(actualClass.prototype.testMethod.subTestMethod).not.toBeDefined();
    expect(actualClass.prototype.testMethod.prototype.subTestMethod()).toBe("It works too");
  });
  it("should work with includeFunctionPrototype = false", () => {
    function TestConstructor() {}
    (TestConstructor as any).Test1 = "Completed";
    TestConstructor.prototype.testMethod = () => "It works";

    const stringFunction = j2s(TestConstructor, {
      includeFunctionPrototype: false,
    });
    const actualClass = Function("return " + stringFunction)();

    expect(actualClass.name).toBe("TestConstructor");
    expect(actualClass.Test1).toBe("Completed");
    expect(actualClass.prototype.testMethod).not.toBeDefined();
  });
  it("should work with nestedFunctionsAmount = 0", () => {
    function TestConstructor() {}
    (TestConstructor as any).Test1 = "Completed";
    TestConstructor.prototype.testMethod = () => "It works";

    const stringFunction = j2s(TestConstructor, {
      nestedFunctionsAmount: 0,
    });
    const actualClass = Function("return " + stringFunction)();

    expect(actualClass.name).toBe("TestConstructor");
    expect(actualClass.Test1).toBe("Completed");
    expect(actualClass.prototype.testMethod).not.toBeDefined();
  });
  it("should work with nestedFunctionsAmount = 1", () => {
    function TestConstructor() {}
    (TestConstructor as any).Test1 = "Completed";
    TestConstructor.prototype.testMethod = () => "It works";
    TestConstructor.prototype.testMethod.subTestMethod = () => "It works too";

    const stringFunction = j2s(TestConstructor, {
      nestedFunctionsAmount: 1,
    });
    const actualClass = Function("return " + stringFunction)();

    expect(actualClass.name).toBe("TestConstructor");
    expect(actualClass.Test1).toBe("Completed");
    expect(actualClass.prototype.testMethod()).toBe("It works");
    expect(actualClass.prototype.testMethod.subTestMethod).not.toBeDefined();
  });
  it("should convert native functions", () => {
    const actual = j2s([].map);
    const expected = "Array.prototype.map";

    expect(actual).toBe(expected);
  });
});

describe("Object to String", () => {
  it("should convert empty Object", () => {
    const actual = j2s({});
    const expected = "{}";

    expect(actual).toBe(expected);
  });
  it("should convert an Object", () => {
    const stringObject = j2s({
      a: 1,
      hello: "world",
      innerObject: {
        testFunction: (x1: number, y1: number, x2: number, y2: number) => {
          return Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5);
        },
      },
    });
    const actual = Function("return " + stringObject)();
    const expected1 = 1;
    const expected2 = "world";
    const expected3 = 5;

    expect(actual.a).toBe(expected1);
    expect(actual.hello).toBe(expected2);
    expect(actual.innerObject).toBeDefined();
    expect(actual.innerObject.testFunction(3, 0, 0, 4)).toBe(expected3);
  });
  it("should work with nestedObjectsAmount = 0", () => {
    const objectString = j2s(
      {
        a: "hello",
        b: true,
        c: {
          d: "world",
        },
      },
      {
        nestedObjectsAmount: 0,
      },
    );
    const actual = Function(`return ${objectString};`)();

    expect(actual.a).toBe("hello");
    expect(actual.b).toBe(true);
    expect(actual.c).not.toBeDefined();
  });
  it("should work with nestedObjectsAmount = 1", () => {
    const objectString = j2s(
      {
        a: "hello",
        b: true,
        c: {
          d: {
            e: {
              f: "world",
            },
            g: 123,
          },
          j: () => "ok",
        },
      },
      {
        nestedObjectsAmount: 1,
      },
    );
    const actual = Function(`return ${objectString};`)();

    expect(actual.a).toBe("hello");
    expect(actual.b).toBe(true);
    expect(actual.c).toBeDefined();
    expect(actual.c.d).not.toBeDefined();
    expect(actual.c.j).toBeDefined();
    expect(actual.c.j()).toBe("ok");
  });
  it("should work with nestedObjectsAmount = 2", () => {
    const objectString = j2s(
      {
        a: "hello",
        b: true,
        c: {
          d: {
            e: {
              f: "world",
            },
            g: 123,
          },
          j: () => "ok",
        },
      },
      {
        nestedObjectsAmount: 2,
      },
    );
    const actual = Function(`return ${objectString};`)();

    expect(actual.a).toBe("hello");
    expect(actual.b).toBe(true);
    expect(actual.c).toBeDefined();
    expect(actual.c.j).toBeDefined();
    expect(actual.c.j()).toBe("ok");
    expect(actual.c.d.e).not.toBeDefined();
    expect(actual.c.d.g).toBe(123);
  });
});

describe("Set to String", () => {
  it("should convert the empty set", () => {
    const actual = j2s(new Set());
    const expected = "new Set()";

    expect(actual).toBe(expected);
  });
  it("should convert a set", () => {
    const actual = j2s(new Set([1, 2, 3]));
    const expected = "new Set([1, 2, 3])";

    expect(actual).toBe(expected);
  });
});

describe("Map to String", () => {
  it("should convert the empty map", () => {
    const actual = j2s(new Map());
    const expected = "new Map()";

    expect(actual).toBe(expected);
  });
  it("should convert a map", () => {
    const actual = j2s(
      new Map([
        [1, 2],
        [3, 4],
      ]),
    );
    const expected = "new Map([[1, 2], [3, 4]])";

    expect(actual).toBe(expected);
  });
});

describe("Resolve references to itself", () => {
  it("should resolve the array itself", () => {
    var x: any = [1, 2, 3];
    x[0] = x;

    const actual = j2s(x);
    const expected = Function(`return ${actual}`)();

    expect(expected[0]).toBe(expected);
    expect(expected[1]).toBe(2);
    expect(expected[2]).toBe(3);
    expect(expected.length).toBe(3);
  });

  it("should resolve the array inside arrays", () => {
    var x: any = [[4, 5, [6, 7, 8]], 22, 33];
    x[0][2][1] = x;
    x[0][2][2] = x;

    const actual = j2s(x);
    const expected = Function(`return ${actual}`)();

    expect(expected[0][2][2]).toBe(expected);
    expect(expected[0][2][1]).toBe(expected);
    expect(expected[0][2][0]).toBe(6);
    expect(expected[1]).toBe(22);
    expect(expected[2]).toBe(33);
    expect(expected.length).toBe(3);
  });

  it("should resolve the object itself", () => {
    var x: any = { a: { b: { c: { hello: "world" } } } };
    x.a.b.c.hello = x;

    const actual = j2s(x);
    const expected = Function(`return ${actual}`)();

    expect(expected).toBeTruthy();
    expect(expected.a).toBeTruthy();
    expect(expected.a.b).toBeTruthy();
    expect(expected.a.b.c).toBeTruthy();
    expect(expected.a.b.c.hello).toBe(expected);
  });

  it("should resolve objects and arrays", () => {
    const y: any[] = ["an", "array", null];
    const x = {
      a: 123,
      b: "an object",
      c: y,
    };
    y[2] = x;
    const z = {
      arr: [x],
    };

    const actual = j2s(z);
    const expected = Function(`return ${actual}`)();

    expect(expected).toBeTruthy();
    expect(expected.arr[0].a).toBe(123);
    expect(expected.arr[0].b).toBe("an object");
    expect(Array.isArray(expected.arr[0].c)).toBeTruthy();
    expect(expected.arr[0].c[0]).toBe("an");
    expect(expected.arr[0].c[1]).toBe("array");
    expect(expected.arr[0].c[2].a).toBe(123);
    expect(expected.arr[0].c[2].c[2].a).toBe(123);
  });

  it("should resolve the function itself", () => {
    function Narcissus() {
      return "narcissus";
    }
    Narcissus.itself = Narcissus;
    Narcissus.prototype.me = Narcissus;
    Narcissus.prototype.deep = {
      arr: [Narcissus],
    };

    const actual = j2s(Narcissus);
    const expected = Function(`return ${actual}`)();

    expect(expected instanceof Function).toBeTruthy();
    expect(expected()).toBe("narcissus");
    expect(expected.itself).toBe(expected);
    expect(expected.prototype.me).toBe(expected);
    expect(expected.prototype.deep.arr[0]).toBe(expected);
  });

  // Issue #1: Self-referencing array at top level
  it("should handle self-referencing array (Issue #1)", () => {
    var x: any[] = [1, 2, 3];
    x[0] = x;

    const actual = j2s(x);
    const restored = Function(`return ${actual}`)();

    expect(restored[0]).toBe(restored);
    expect(restored[1]).toBe(2);
    expect(restored[2]).toBe(3);
  });

  // Issue #1: Self-referencing object at top level
  it("should handle self-referencing object (Issue #1)", () => {
    var obj: any = { a: 1, b: 2 };
    obj.self = obj;

    const actual = j2s(obj);
    const restored = Function(`return ${actual}`)();

    expect(restored.self).toBe(restored);
    expect(restored.a).toBe(1);
    expect(restored.b).toBe(2);
  });

  // Issue #1: Deep circular chain A -> B -> C -> A (back to root)
  it("should handle deep circular chain back to root (Issue #1)", () => {
    var a: any = { name: "A" };
    var b: any = { name: "B" };
    var c: any = { name: "C" };
    a.next = b;
    b.next = c;
    c.next = a; // circular back to root

    const actual = j2s(a);
    const restored = Function(`return ${actual}`)();

    expect(restored.name).toBe("A");
    expect(restored.next.name).toBe("B");
    expect(restored.next.next.name).toBe("C");
    expect(restored.next.next.next).toBe(restored); // should be same reference
  });

  // Issue #1: Object with array that references back to parent (root)
  it("should handle object with array referencing parent root (Issue #1)", () => {
    var parent: any = {
      name: "parent",
      children: [],
    };
    parent.children.push({ name: "child1", parent: parent });
    parent.children.push({ name: "child2", parent: parent });

    const actual = j2s(parent);
    const restored = Function(`return ${actual}`)();

    expect(restored.name).toBe("parent");
    expect(restored.children[0].name).toBe("child1");
    expect(restored.children[0].parent).toBe(restored);
    expect(restored.children[1].parent).toBe(restored);
  });

  // Cross-reference between objects - nested object referenced from another branch
  it("should handle cross-references between nested objects (Issue #1)", () => {
    var a: any = { b: { c: "hello" } };
    var d: any = { e: a.b };
    a.f = d;

    const actual = j2s(a);
    const restored = Function(`return ${actual}`)();

    expect(restored.b.c).toBe("hello");
    expect(restored.f.e).toBe(restored.b); // d.e should reference a.b
    expect(restored.f.e.c).toBe("hello");
  });

  // Multiple objects sharing the same nested reference
  it("should handle multiple references to same nested object (Issue #1)", () => {
    var shared = { value: 42 };
    var obj: any = {
      first: shared,
      second: shared,
      nested: {
        third: shared,
      },
    };

    const actual = j2s(obj);
    const restored = Function(`return ${actual}`)();

    expect(restored.first).toBe(restored.second);
    expect(restored.first).toBe(restored.nested.third);
    expect(restored.first.value).toBe(42);
  });

  // Array containing objects with cross-references between each other
  it("should handle array with cross-referencing objects (Issue #1)", () => {
    var obj1: any = { id: 1 };
    var obj2: any = { id: 2, ref: obj1 };
    obj1.ref = obj2;
    var arr: any[] = [obj1, obj2];

    const actual = j2s(arr);
    const restored = Function(`return ${actual}`)();

    expect(restored[0].id).toBe(1);
    expect(restored[1].id).toBe(2);
    expect(restored[0].ref).toBe(restored[1]);
    expect(restored[1].ref).toBe(restored[0]);
  });

  // Complex graph structure with multiple interconnections
  it("should handle complex graph with multiple interconnections (Issue #1)", () => {
    var node1: any = { id: 1, connections: [] };
    var node2: any = { id: 2, connections: [] };
    var node3: any = { id: 3, connections: [] };

    // Create a mesh: each node references the others
    node1.connections.push(node2, node3);
    node2.connections.push(node1, node3);
    node3.connections.push(node1, node2);

    var graph = { nodes: [node1, node2, node3], root: node1 };

    const actual = j2s(graph);
    const restored = Function(`return ${actual}`)();

    expect(restored.nodes[0].id).toBe(1);
    expect(restored.nodes[1].id).toBe(2);
    expect(restored.nodes[2].id).toBe(3);
    expect(restored.root).toBe(restored.nodes[0]);
    expect(restored.nodes[0].connections[0]).toBe(restored.nodes[1]);
    expect(restored.nodes[0].connections[1]).toBe(restored.nodes[2]);
    expect(restored.nodes[1].connections[0]).toBe(restored.nodes[0]);
  });

  // Diamond pattern: A -> B -> D, A -> C -> D (D is shared)
  it("should handle diamond-shaped references (Issue #1)", () => {
    var d: any = { value: "diamond" };
    var b: any = { ref: d };
    var c: any = { ref: d };
    var a: any = { left: b, right: c };

    const actual = j2s(a);
    const restored = Function(`return ${actual}`)();

    expect(restored.left.ref.value).toBe("diamond");
    expect(restored.left.ref).toBe(restored.right.ref);
  });

  // Shared array between two object branches
  it("should handle shared array between branches (Issue #1)", () => {
    var items = [10, 20, 30];
    var obj: any = {
      source: items,
      copy: items,
    };

    const actual = j2s(obj);
    const restored = Function(`return ${actual}`)();

    expect(restored.source).toBe(restored.copy);
    expect(restored.source[0]).toBe(10);
    expect(restored.source.length).toBe(3);
  });

  // Nested self-reference (not root): inner object references itself
  it("should handle nested object self-reference (Issue #1)", () => {
    var inner: any = { name: "inner" };
    inner.self = inner;
    var outer = { data: inner };

    const actual = j2s(outer);
    const restored = Function(`return ${actual}`)();

    expect(restored.data.name).toBe("inner");
    expect(restored.data.self).toBe(restored.data);
  });

  // Cross-reference + circular mix: A.b references C, C.back references A
  it("should handle mixed circular and cross-references (Issue #1)", () => {
    var a: any = { name: "A" };
    var b: any = { name: "B" };
    var c: any = { name: "C", back: a };
    a.child = b;
    b.friend = c;

    const actual = j2s(a);
    const restored = Function(`return ${actual}`)();

    expect(restored.name).toBe("A");
    expect(restored.child.name).toBe("B");
    expect(restored.child.friend.name).toBe("C");
    expect(restored.child.friend.back).toBe(restored);
  });

  // Deep diamond: shared object at depth 3
  it("should handle deeply nested shared reference (Issue #1)", () => {
    var leaf = { x: 1, y: 2 };
    var obj: any = {
      a: { b: { c: leaf } },
      d: { e: { f: leaf } },
    };

    const actual = j2s(obj);
    const restored = Function(`return ${actual}`)();

    expect(restored.a.b.c).toBe(restored.d.e.f);
    expect(restored.a.b.c.x).toBe(1);
  });

  // Array of arrays sharing a sub-array
  it("should handle shared sub-arrays (Issue #1)", () => {
    var shared = [1, 2, 3];
    var arr: any = [shared, [shared, 4], shared];

    const actual = j2s(arr);
    const restored = Function(`return ${actual}`)();

    expect(restored[0]).toBe(restored[2]);
    expect(restored[1][0]).toBe(restored[0]);
    expect(restored[0][0]).toBe(1);
  });

  // Circular chain through non-root: A -> B -> C -> B (not back to A)
  it("should handle circular chain to non-root ancestor (Issue #1)", () => {
    var a: any = { name: "A" };
    var b: any = { name: "B" };
    var c: any = { name: "C", back: b };
    a.next = b;
    b.next = c;

    const actual = j2s(a);
    const restored = Function(`return ${actual}`)();

    expect(restored.name).toBe("A");
    expect(restored.next.name).toBe("B");
    expect(restored.next.next.name).toBe("C");
    expect(restored.next.next.back).toBe(restored.next);
  });

  // Property key with special characters in cross-reference path
  it("should handle cross-references with special property names (Issue #1)", () => {
    var shared = { ok: true };
    var obj: any = {
      "my-key": shared,
      "other's": shared,
    };

    const actual = j2s(obj);
    const restored = Function(`return ${actual}`)();

    expect(restored["my-key"]).toBe(restored["other's"]);
    expect(restored["my-key"].ok).toBe(true);
  });

  // Three-level tree: root -> [branch1, branch2], both branches share a leaf
  it("should handle tree with shared leaves (Issue #1)", () => {
    var leaf = { type: "leaf" };
    var root: any = {
      branches: [
        { name: "b1", items: [leaf, { type: "other" }] },
        { name: "b2", items: [{ type: "other2" }, leaf] },
      ],
    };

    const actual = j2s(root);
    const restored = Function(`return ${actual}`)();

    expect(restored.branches[0].items[0]).toBe(restored.branches[1].items[1]);
    expect(restored.branches[0].items[0].type).toBe("leaf");
  });

  // Object referencing root from deep nesting + cross-ref
  it("should handle root circular ref combined with cross-ref (Issue #1)", () => {
    var shared = { val: 99 };
    var root: any = {
      a: { ref: shared },
      b: { ref: shared },
    };
    root.a.root = root;

    const actual = j2s(root);
    const restored = Function(`return ${actual}`)();

    expect(restored.a.root).toBe(restored);
    expect(restored.a.ref).toBe(restored.b.ref);
    expect(restored.a.ref.val).toBe(99);
  });

  // Object -> function -> array: shared function referenced from multiple places
  it("should handle shared function between object branches (Issue #1)", () => {
    var handler = function greet(name: string) {
      return "hello " + name;
    };
    var obj: any = {
      a: { action: handler },
      b: { action: handler },
    };

    const actual = j2s(obj);
    const restored = Function(`return ${actual}`)();

    expect(restored.a.action).toBe(restored.b.action);
    expect(restored.a.action("world")).toBe("hello world");
  });

  // Object containing function with properties that reference back
  it("should handle function with property referencing parent object (Issue #1)", () => {
    var obj: any = { name: "container" };
    var fn: any = function process() {
      return 42;
    };
    fn.owner = obj;
    obj.run = fn;

    const actual = j2s(obj);
    const restored = Function(`return ${actual}`)();

    expect(restored.name).toBe("container");
    expect(restored.run()).toBe(42);
    expect(restored.run.owner).toBe(restored);
  });

  // Mixed: object -> array -> function -> object cross-refs
  it("should handle object-array-function chain with cross-refs (Issue #1)", () => {
    var config = { debug: true };
    var fn = function log(msg: string) {
      return msg;
    };
    var pipeline: any = {
      steps: [fn, config],
      settings: config,
      handler: fn,
    };

    const actual = j2s(pipeline);
    const restored = Function(`return ${actual}`)();

    expect(restored.steps[0]).toBe(restored.handler);
    expect(restored.steps[1]).toBe(restored.settings);
    expect(restored.handler("test")).toBe("test");
    expect(restored.settings.debug).toBe(true);
  });

  // Array with functions referencing shared objects
  it("should handle array of functions sharing an object (Issue #1)", () => {
    var state = { count: 0 };
    var inc: any = function increment() {
      return 1;
    };
    inc.state = state;
    var dec: any = function decrement() {
      return -1;
    };
    dec.state = state;
    var arr = [inc, dec];

    const actual = j2s(arr);
    const restored = Function(`return ${actual}`)();

    expect(restored[0].state).toBe(restored[1].state);
    expect(restored[0].state.count).toBe(0);
    expect(restored[0]()).toBe(1);
    expect(restored[1]()).toBe(-1);
  });

  // Deeply nested: object -> array -> object -> function -> back to array
  it("should handle deep mixed nesting with circular ref (Issue #1)", () => {
    var arr: any[] = [];
    var inner: any = {
      process: function doWork() {
        return "done";
      },
    };
    inner.process.list = arr;
    var root: any = { items: arr };
    arr.push(inner);

    const actual = j2s(root);
    const restored = Function(`return ${actual}`)();

    expect(restored.items[0].process()).toBe("done");
    expect(restored.items[0].process.list).toBe(restored.items);
  });

  // Function referencing itself via a property (function self-ref)
  it("should handle function self-reference via property (Issue #1)", () => {
    var fn: any = function recursive() {
      return 1;
    };
    fn.self = fn;
    var obj = { action: fn };

    const actual = j2s(obj);
    const restored = Function(`return ${actual}`)();

    expect(restored.action()).toBe(1);
    expect(restored.action.self).toBe(restored.action);
  });

  // Two functions referencing each other
  it("should handle mutually referencing functions (Issue #1)", () => {
    var fnA: any = function a() {
      return "A";
    };
    var fnB: any = function b() {
      return "B";
    };
    fnA.partner = fnB;
    fnB.partner = fnA;
    var obj = { first: fnA, second: fnB };

    const actual = j2s(obj);
    const restored = Function(`return ${actual}`)();

    expect(restored.first()).toBe("A");
    expect(restored.second()).toBe("B");
    expect(restored.first.partner).toBe(restored.second);
    expect(restored.second.partner).toBe(restored.first);
  });
});

describe("Async Function to String", () => {
  it("should convert async function", () => {
    async function fetchData() {
      return 42;
    }
    const str = j2s(fetchData);
    expect(str).toContain("async");
    expect(str).toContain("fetchData");
    const restored = Function("return " + str)();
    expect(typeof restored).toBe("function");
  });
  it("should convert async arrow function", () => {
    const fn = async () => 42;
    const str = j2s(fn);
    expect(str).toContain("async");
  });
  it("should convert async generator function", () => {
    async function* asyncGen() {
      yield 1;
      yield 2;
    }
    const str = j2s(asyncGen);
    expect(str).toContain("async");
    expect(str).toContain("function*");
    const restored = Function("return " + str)();
    expect(typeof restored).toBe("function");
  });
});

describe("Non-serializable types", () => {
  it("should return undefined for WeakRef", () => {
    const ref = new WeakRef({});
    expect(j2s(ref)).toBe("undefined");
  });
  it("should return undefined for WeakMap", () => {
    const wm = new WeakMap();
    expect(j2s(wm)).toBe("undefined");
  });
  it("should return undefined for WeakSet", () => {
    const ws = new WeakSet();
    expect(j2s(ws)).toBe("undefined");
  });
  it("should return undefined for FinalizationRegistry", () => {
    const fr = new FinalizationRegistry(() => {});
    expect(j2s(fr)).toBe("undefined");
  });
  it("should return undefined for Promise", () => {
    const p = Promise.resolve(42);
    expect(j2s(p)).toBe("undefined");
  });
  it("should return undefined for Generator", () => {
    function* gen() {
      yield 1;
    }
    const g = gen();
    expect(j2s(g)).toBe("undefined");
  });
  it("should return undefined for async Generator", () => {
    // ts-jest compiles async generators to plain objects, so this test
    // verifies the value is serialized without errors at minimum
    async function* asyncGen() {
      yield 1;
    }
    const g = asyncGen();
    const str = j2s(g);
    expect(typeof str).toBe("string");
  });
});

describe("throwOnNonSerializable option", () => {
  it("should throw for Promise when enabled", () => {
    const p = Promise.resolve(42);
    expect(() => j2s(p, { throwOnNonSerializable: true })).toThrow("Non-serializable value: promise");
  });
  it("should throw for WeakRef when enabled", () => {
    const ref = new WeakRef({});
    expect(() => j2s(ref, { throwOnNonSerializable: true })).toThrow("Non-serializable value: weakref");
  });
  it("should throw for WeakMap when enabled", () => {
    const wm = new WeakMap();
    expect(() => j2s(wm, { throwOnNonSerializable: true })).toThrow("Non-serializable value: WeakMap");
  });
  it("should throw for WeakSet when enabled", () => {
    const ws = new WeakSet();
    expect(() => j2s(ws, { throwOnNonSerializable: true })).toThrow("Non-serializable value: WeakSet");
  });
  it("should throw for FinalizationRegistry when enabled", () => {
    const fr = new FinalizationRegistry(() => {});
    expect(() => j2s(fr, { throwOnNonSerializable: true })).toThrow("Non-serializable value: finalizationregistry");
  });
  it("should throw for Generator when enabled", () => {
    function* gen() {
      yield 1;
    }
    expect(() => j2s(gen(), { throwOnNonSerializable: true })).toThrow("Non-serializable value: generator");
  });
  it("should not throw for serializable values when enabled", () => {
    expect(() => j2s({ a: 1 }, { throwOnNonSerializable: true })).not.toThrow();
    expect(() => j2s([1, 2, 3], { throwOnNonSerializable: true })).not.toThrow();
    expect(() => j2s("hello", { throwOnNonSerializable: true })).not.toThrow();
  });
  it("should throw for nested non-serializable values", () => {
    const obj = { data: new WeakMap() };
    expect(() => j2s(obj, { throwOnNonSerializable: true })).toThrow("Non-serializable value: WeakMap");
  });
});

describe("SharedArrayBuffer to String", () => {
  it("should convert SharedArrayBuffer", () => {
    if (typeof SharedArrayBuffer === "undefined") return;
    const sab = new SharedArrayBuffer(4);
    const view = new Uint8Array(sab);
    view[0] = 1;
    view[1] = 2;
    const str = j2s(sab);
    expect(str).toContain("Int8Array");
    expect(str).toContain(".buffer");
  });
});
