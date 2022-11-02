/*
 * @Author: Yanc
 * @Date: 2022-10-30 14:38:59
 * @LastEditTime: 2022-11-02 23:34:24
 */
import { reactive } from "../reactive";
import { effect, stop } from "../effect";

describe("effect", () => {
  it("happy patch", () => {
    const user = reactive({
      age: 10,
    });
    let nextAge;

    effect(() => {
      nextAge = user.age + 1;
    });

    // 初始化
    expect(nextAge).toBe(11);

    // 更新
    user.age++;
    expect(nextAge).toBe(12);
  });

  it("effect应该返回一个runner(调用它能够重新触发副作用函数)", () => {
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "foo";
    });
    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("foo");
  });

  it("scheduler", () => {
    // 1. 通过effect 的第二个参数给定的一个scheduler的函数
    // 2. effect 第一次执行的时候还是会执行 fn
    // 3. 当响应式对象set update 不会执行 fn 而是 scheduler
    // 4. 如果当执行 runnner 的时候 会再次执行 fn
    let dummy;
    let run;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    //
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
  });

  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });

    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.prop = 3;
    expect(dummy).toBe(2);
    obj.prop++; // 这里实际上是obj.prop=obj.prop+1 在这个过程中，会重新触发一次 get 收集依赖过程
    expect(dummy).toBe(2);

    runner();
    expect(dummy).toBe(4);
  });

  it("onStop", () => {
    const obj = reactive({ foo: 1 });

    const onStop = jest.fn();

    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { onStop }
    );

    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});
