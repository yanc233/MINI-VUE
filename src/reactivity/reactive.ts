/*
 * @Author: Yanc
 * @Date: 2022-10-30 14:53:56
 * @LastEditTime: 2022-12-07 00:40:31
 */

import {
  mutableHandlers,
  readonlyHanders,
  shallowReadonlyHanders,
} from "./baseHanders";
import { isObject } from "./../shared";

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

function createActiveObject(target, baseHanders) {
  if (!isObject(target)) {
    console.warn(`target ${target} 必须是一个对象`);
  }
  return new Proxy(target, baseHanders);
}
