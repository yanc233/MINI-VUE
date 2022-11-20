import { extend } from "./../../shared/index";
import { reactive } from "../reactive";
import { computed } from "../computed";

/*
 * @Author: Yanc
 * @Date: 2022-11-19 20:18:57
 * @LastEditTime: 2022-11-19 20:37:57
 */
describe("computed", () => {
  it("happy path", () => {
    const user = reactive({
      age: 1,
    });

    const age = computed(() => {
      return user.age;
    });

    expect(age.value).toBe(user.age);
  });

  it("should compute lazily", () => {
    const value = reactive({
      foo: 1,
    });

    const getter = jest.fn(() => {
      return value.foo;
    });

    const cValue = computed(getter);

    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalled();

    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute until needed
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);

    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
