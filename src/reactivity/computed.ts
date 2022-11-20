import { ReactiveEffect } from "./effect";
/*
 * @Author: Yanc
 * @Date: 2022-11-19 20:18:38
 * @LastEditTime: 2022-11-19 21:06:25
 */

class ComputedRefImpl {
  private _getter;
  private _dirty = true;
  private _value;
  private _effect;

  constructor(getter) {
    this._getter = getter;
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }

  get value() {
    // 当依赖的响应值发生改变的时候，修改dirty
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
    }
    return this._value;
  }
}

export const computed = (getter) => {
  return new ComputedRefImpl(getter);
};
