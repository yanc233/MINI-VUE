/*
 * @Author: Yanc
 * @Date: 2022-11-19 21:36:24
 * @LastEditTime: 2022-12-06 23:09:08
 */
import { ShapeFlags } from "../shared/ShapFlages";

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    shapeFlage: getShapeFlage(type),
    el: null,
  };

  if (typeof vnode.children === "string") {
    vnode.shapeFlage |= ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapeFlage |= ShapeFlags.ARRAY_CHILDREN;
  }

  return vnode;
}

function getShapeFlage(type) {
  return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}
