import j2s from "../src/javascripttostring";

describe("Function to String", () => {
  it("should convert generator function", () => {
    function* generator(i: number) {
      yield i;
      yield i + 10;
    }

    const stringFunction = j2s(generator);
    const actual = Function("return " + stringFunction)();
    const gen = actual(10);

    expect(gen.next().value).toBe(10);
    expect(gen.next().value).toBe(20);
  });
});
