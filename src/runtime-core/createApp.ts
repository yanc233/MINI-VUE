import { createVNode } from "./vnode";
import { render } from "./renderer";

/*
 * @Author: Yanc
 * @Date: 2022-11-19 21:30:29
 * @LastEditTime: 2022-11-27 15:47:02
 */
export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 先vnode
      // component -> vnode
      // 所有逻辑操作都基于 vnode 处理

      const vnode = createVNode(rootComponent);
      render(vnode, rootContainer);
    },
  };
}
