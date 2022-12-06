/*
 * @Author: Yanc
 * @Date: 2022-10-31 00:00:20
 * @LastEditTime: 2022-12-06 23:58:42
 */

import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";
import { extend, isObject } from "../shared";

const get = creatGetter();
const set = createSetter();
const readonlyGet = creatGetter(true);
const shallowReadonlyGet = creatGetter(true, true);

function creatGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly; // 只要不是一个只读对象，都会返回一个true
    }

    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }

    const res = Reflect.get(target, key);

    if (shallow) {
      return res;
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    //  依赖收集
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    // 触发依赖
    trigger(target, key);
    return res;
  };
}

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHanders = {
  get: readonlyGet,
  set(target, key) {
    console.warn(`key:${key} set 失败，因为target 是readonly ${target}`);
    return true;
  },
};

export const shallowReadonlyHanders = extend({}, readonlyHanders, {
  get: shallowReadonlyGet,
});
