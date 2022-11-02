import { isObject } from "./../shared/index";
/*
 * @Author: Yanc
 * @Date: 2022-11-03 00:17:16
 * @LastEditTime: 2022-11-03 01:03:16
 */

import { trackEffects, triggerEffects, isTraking } from "./effect";
import { hasChanged } from "../shared";
import { reactive } from "./reactive";

class RefImpl {
  private _value;
  private _rawValue;
  public dep;
  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      //一定先修改value
      this._value = convert(newValue);
      triggerEffects(this.dep);
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref) {
  if (isTraking()) {
    trackEffects(ref.dep);
  }
}
export function ref(value) {
  return new RefImpl(value);
}
