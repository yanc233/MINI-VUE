'use strict';

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        shapeFlage: getShapeFlage(type),
        el: null,
    };
    if (typeof vnode.children === "string") {
        vnode.shapeFlage |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlage |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlage(type) {
    return typeof type === "string"
        ? 1 /* ShapeFlags.ELEMENT */
        : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

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
const publicInstanceProxyHandlers = {
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

/*
 * @Author: Yanc
 * @Date: 2022-11-27 15:54:02
 * @LastEditTime: 2022-11-27 18:35:34
 */
function createComponentInstance(vnode) {
    const components = { vnode, type: vnode.type, setupState: {} };
    return components;
}
function setupComponent(instance) {
    // init props
    //init slots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.vnode.type;
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
        // function  or  Object
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

/*
 * @Author: Yanc
 * @Date: 2022-11-27 15:39:24
 * @LastEditTime: 2022-12-06 22:54:18
 */
function render(vnode, container) {
    // patch
    patch(vnode, container);
}
function patch(vnode, container) {
    // 判断vnode 是不是 element
    const { shapeFlage } = vnode;
    if (shapeFlage & 1 /* ShapeFlags.ELEMENT */) {
        processElement(vnode, container);
    }
    else if (shapeFlage & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const { type, children, props, shapeFlage } = vnode;
    const el = (vnode.el = document.createElement(type));
    if (shapeFlage & 4 /* ShapeFlags.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlage & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
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
function mountComponent(initialVNode, container) {
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

/*
 * @Author: Yanc
 * @Date: 2022-11-19 21:30:29
 * @LastEditTime: 2022-11-27 15:47:02
 */
function createApp(rootComponent) {
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

/*
 * @Author: Yanc
 * @Date: 2022-11-27 16:46:10
 * @LastEditTime: 2022-11-27 16:46:55
 */
function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
