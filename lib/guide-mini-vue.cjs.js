'use strict';

/*
 * @Author: Yanc
 * @Date: 2022-11-19 21:36:24
 * @LastEditTime: 2022-11-27 18:16:18
 */
function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null,
    };
    return vnode;
}

/*
 * @Author: Yanc
 * @Date: 2022-10-30 23:38:16
 * @LastEditTime: 2022-11-03 00:51:51
 */
const isObject = (val) => {
    return val !== null && typeof val === "object";
};

/*
 * @Author: Yanc
 * @Date: 2022-11-27 18:31:21
 * @LastEditTime: 2022-11-27 18:42:02
 */
const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
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
 * @LastEditTime: 2022-11-27 18:27:05
 */
function render(vnode, container) {
    // patch
    patch(vnode, container);
}
function patch(vnode, container) {
    // 判断vnode 是不是 element
    if (typeof vnode.type === "string") {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const { type, children, props } = vnode;
    const el = (vnode.el = document.createElement(type));
    if (typeof children === "string") {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
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
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, vnode, container);
}
function setupRenderEffect(instance, vnode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vnode-> patch
    patch(subTree, container);
    vnode.el = subTree.el;
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
