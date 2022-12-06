import { ShapeFlags } from "../shared/ShapFlages";
import { isObject } from "./../shared";
import { createComponentInstance, setupComponent } from "./component";

/*
 * @Author: Yanc
 * @Date: 2022-11-27 15:39:24
 * @LastEditTime: 2022-12-06 23:59:35
 */
export function render(vnode, container) {
  // patch

  patch(vnode, container);
}

function patch(vnode, container) {
  // 判断vnode 是不是 element
  const { shapeFlage } = vnode;

  if (shapeFlage & ShapeFlags.ELEMENT) {
    processElement(vnode, container);
  } else if (shapeFlage & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container);
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}
function mountElement(vnode, container) {
  const { type, children, props, shapeFlage } = vnode;
  const el = (vnode.el = document.createElement(type));

  if (shapeFlage & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlage & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el);
  }

  for (const key in props) {
    const val = props[key];
    // on + Event name 事件的命名规范
    const isOn = (key: string) => /^on[A-Z]/.test(key);

    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, val);
    } else {
      el.setAttribute(key, val);
    }
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
