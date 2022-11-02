/*
 * @Author: Yanc
 * @Date: 2022-10-30 14:53:56
 * @LastEditTime: 2022-11-03 00:08:35
 */

import {
  mutableHandlers,
  readonlyHanders,
  shallowReadonlyHanders,
} from "./baseHanders";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHanders);
}

export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHanders);
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}

function createActiveObject(raw: any, baseHanders) {
  return new Proxy(raw, baseHanders);
}
