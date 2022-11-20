import { isObject } from "./../shared/index";
/*
 * @Author: Yanc
 * @Date: 2022-11-03 00:17:16
 * @LastEditTime: 2022-11-19 20:15:20
 */

import { trackEffects, triggerEffects, isTraking } from "./effect";
import { hasChanged } from "../shared";
import { reactive } from "./reactive";

class RefImpl {
  private _value;
  private _rawValue;
  public dep;
  public __v_isRef = true;

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
    // 为了保证对比的时候时候两个普通的obj对比 引入了 _rawValue
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
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
export function isRef(ref) {
  return !!ref.__v_isRef;
}
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      // 判断要设置的值原本是不是一个ref 已经设置的新值是不是一个ref
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}
