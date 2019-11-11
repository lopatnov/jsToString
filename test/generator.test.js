var j2s = require("../dist/javascripttostring.umd.js");

describe("Function to String", () => {
  it("should convert generator function", () => {
    function* generator(i) {
      yield i;
      yield i + 10;
    }

    let stringFunction = j2s(generator);
    let actual = Function("return " + stringFunction)();
    var gen = actual(10);

    expect(gen.next().value).toBe(10);
    expect(gen.next().value).toBe(20);
  });
});
