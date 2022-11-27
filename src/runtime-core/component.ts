import { publicInstanceProxyHandlers } from "./componentPublicInstance";

/*
 * @Author: Yanc
 * @Date: 2022-11-27 15:54:02
 * @LastEditTime: 2022-11-27 18:35:34
 */
export function createComponentInstance(vnode) {
  const components = { vnode, type: vnode.type, setupState: {} };

  return components;
}

export function setupComponent(instance) {
  // init props
  //init slots

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.vnode.type;

  instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);

  const { setup } = Component;

  if (setup) {
    // function  or  Object
    const setupResult = setup();

    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance, setupResult: any) {
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}
