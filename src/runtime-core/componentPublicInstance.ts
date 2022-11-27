/*
 * @Author: Yanc
 * @Date: 2022-11-27 18:31:21
 * @LastEditTime: 2022-11-27 18:43:28
 */

const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
  // #$data...
  // #
};

export const publicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState } = instance;
    // setupState
    if (key in setupState) {
      return setupState[key];
    }

    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
