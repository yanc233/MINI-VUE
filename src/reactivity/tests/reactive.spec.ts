/*
 * @Author: Yanc
 * @Date: 2022-10-30 14:50:58
 * @LastEditTime: 2022-11-02 23:50:27
 */
import { reactive, isReactive } from "../reactive";

describe("reactive", () => {
  it("happy path", () => {
    const original = {
      foo: 1,
      next: {
        bar: {
          foo: 2,
        },
      },
    };
    const observed = reactive(original);

    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);

    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);

    expect(isReactive(observed.next)).toBe(true);
    expect(isReactive(observed.next.bar)).toBe(true);
  });
});
