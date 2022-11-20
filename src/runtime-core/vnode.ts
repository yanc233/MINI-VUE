/*
 * @Author: Yanc
 * @Date: 2022-11-19 21:36:24
 * @LastEditTime: 2022-11-20 23:51:02
 */
export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
  };
  return vnode;
}
