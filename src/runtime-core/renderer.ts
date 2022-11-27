import { isObject } from "./../shared/index";
import { createComponentInstance, setupComponent } from "./component";

/*
 * @Author: Yanc
 * @Date: 2022-11-27 15:39:24
 * @LastEditTime: 2022-11-27 18:46:05
 */
export function render(vnode, container) {
  // patch

  patch(vnode, container);
}

function patch(vnode, container) {
  // 判断vnode 是不是 element
  if (typeof vnode.type === "string") {
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container);
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}
function mountElement(vnode, container) {
  const { type, children, props } = vnode;
  const el = (vnode.el = document.createElement(type));

  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el);
  }

  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }

  el.setAttribute("id", "root");

  container.append(el);
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(initialVNode: any, container) {
  const instance = createComponentInstance(initialVNode);

  setupComponent(instance);
  setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  // vnode-> patch
  patch(subTree, container);
  initialVNode.el = subTree.el;
}

function mountChildren(vnode, container) {
  vnode.children.forEach((v) => {
    patch(v, container);
  });
}
