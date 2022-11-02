/*
 * @Author: Yanc
 * @Date: 2022-10-30 23:49:07
 * @LastEditTime: 2022-11-03 00:09:29
 */
import { shallowReadonly, isReadonly, isProxy } from "../reactive";

describe("readonly", () => {
  it("happy path", () => {
    const original = { foo: 1, bar: { baz: 2 } };

    const wrapped = shallowReadonly(original);

    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);

    expect(isReadonly(wrapped)).toBe(true);
    expect(isProxy(wrapped)).toBe(true);

    expect(isReadonly(original)).toBe(false);
    expect(isProxy(original)).toBe(false);

    expect(isReadonly(wrapped.bar)).toBe(false);
  });

  it("warn then call set", () => {
    console.warn = jest.fn();

    const user = shallowReadonly({
      age: 10,
    });
    user.age = 11;

    expect(console.warn).toBeCalled();
  });
});
