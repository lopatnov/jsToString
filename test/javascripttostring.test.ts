let j2s = require('../src/javascripttostring').default;

describe("Boolean to String tests", () => {
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
describe("Number to String tests", () => {
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