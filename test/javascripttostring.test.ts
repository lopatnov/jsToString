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
    const expected = 'new Error("A mistake", undefined, undefined)';

    expect(actual).toBe(expected);
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
    TestConstructor.prototype.testMethod = () => "It works";
    TestConstructor.prototype.testMethod.subTestMethod = () => "It not works";
    TestConstructor.prototype.testMethod.prototype.subTestMethod = () => "It works too";

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

  // ============================================================================
  // Known limitation: Cross-references between non-root nested objects
  // The current implementation only handles circular references back to the root.
  // These tests document expected behavior for future improvements.
  // ============================================================================

  // Future: Cross-reference between objects - nested object referenced from another branch
  it.skip("should handle cross-references between nested objects (future)", () => {
    var a: any = { b: { c: "hello" } };
    var d: any = { e: a.b };
    a.f = d;

    const actual = j2s(a);
    const restored = Function(`return ${actual}`)();

    expect(restored.b.c).toBe("hello");
    expect(restored.f.e).toBe(restored.b); // d.e should reference a.b
    expect(restored.f.e.c).toBe("hello");
  });

  // Future: Multiple objects sharing the same nested reference
  it.skip("should handle multiple references to same nested object (future)", () => {
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

  // Future: Array containing objects with cross-references between each other
  it.skip("should handle array with cross-referencing objects (future)", () => {
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

  // Future: Complex graph structure with multiple interconnections
  it.skip("should handle complex graph with multiple interconnections (future)", () => {
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
});
