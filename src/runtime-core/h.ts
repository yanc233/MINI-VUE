/*
 * @Author: Yanc
 * @Date: 2022-11-27 16:46:10
 * @LastEditTime: 2022-11-27 16:46:55
 */
import { createVNode } from "./vnode";

export function h(type, props?, children?) {
  return createVNode(type, props, children);
}
