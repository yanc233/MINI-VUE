/*
 * @Author: Yanc
 * @Date: 2022-11-19 21:36:24
 * @LastEditTime: 2022-11-27 18:16:18
 */
export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    el: null,
  };
  return vnode;
}
