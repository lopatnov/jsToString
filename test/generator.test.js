var j2s = require("../src/javascripttostring").default;

describe("Function to String", () => {
  it("should convert generator function", () => {
    function* generator(i) {
      yield i;
      yield i + 10;
    }

    const stringFunction = j2s(generator);
    const actual = Function("return " + stringFunction)();
    var gen = actual(10);

    expect(gen.next().value).toBe(10);
    expect(gen.next().value).toBe(20);
  });
});
