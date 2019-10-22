let j2s = require("../src/javascripttostring").default;

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
      console.log(numbers);
      return Array.prototype.reduce.call(
        numbers,
        (accumulator: any, currentValue: any) => {
          return accumulator + currentValue;
        }, 0
      );
    }

    let stringFunction = j2s(sum);
    let actual = Function("return " + stringFunction)();
    let expected = 10;

    expect(actual(1,2,3,4)).toBe(expected);
  });
  it("should convert lambda function", () => {
    let stringFunction = j2s((a: any, b: any) => {
      return a * b;
    });
    let actual = Function("return " + stringFunction)();
    let expected = 12;

    expect(actual(3,4)).toBe(expected);
  });
});
