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
 * @Date: 2022-10-30 23:38:16
 * @LastEditTime: 2022-12-06 23:57:52
 */
const extend = Object.assign;
const isObject = (val) => {
    return val !== null && typeof val === "object";
};
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);

/*
 * @Author: Yanc
 * @Date: 2022-10-30 15:06:53
 * @LastEditTime: 2022-11-19 20:47:11
 */
const targetMap = new Map();
// 触发依赖
// 基于target 和 key 找到依赖对应的存储 set,遍历调用所有的副作用
function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}

/*
 * @Author: Yanc
 * @Date: 2022-10-31 00:00:20
 * @LastEditTime: 2022-12-06 23:58:42
 */
const get = creatGetter();
const set = createSetter();
const readonlyGet = creatGetter(true);
const shallowReadonlyGet = creatGetter(true, true);
function creatGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly; // 只要不是一个只读对象，都会返回一个true
        }
        if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        // 触发依赖
        trigger(target, key);
        return res;
    };
}
const mutableHandlers = {
    get,
    set,
};
const readonlyHanders = {
    get: readonlyGet,
    set(target, key) {
        console.warn(`key:${key} set 失败，因为target 是readonly ${target}`);
        return true;
    },
};
const shallowReadonlyHanders = extend({}, readonlyHanders, {
    get: shallowReadonlyGet,
});

/*
 * @Author: Yanc
 * @Date: 2022-10-30 14:53:56
 * @LastEditTime: 2022-12-07 00:40:31
 */
function reactive(raw) {
    return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHanders);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHanders);
}
function createActiveObject(target, baseHanders) {
    if (!isObject(target)) {
        console.warn(`target ${target} 必须是一个对象`);
    }
    return new Proxy(target, baseHanders);
}

/*
 * @Author: Yanc
 * @Date: 2022-12-07 00:14:19
 * @LastEditTime: 2022-12-07 00:42:46
 */
function emit(instance, event, ...args) {
    const { props } = instance;
    // 转驼峰
    const camelize = (str) => {
        return str.replace(/-(\w)/g, (_, c) => {
            return c ? c.toUpperCase() : "";
        });
    };
    // 首字母大写
    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    // 转换名称
    const toHandlerKey = (str) => {
        return str ? "on" + capitalize(str) : "";
    };
    const handlerName = toHandlerKey(camelize(event));
    const hander = props[handlerName];
    hander && hander(...args);
}

/*
 * @Author: Yanc
 * @Date: 2022-12-06 23:32:29
 * @LastEditTime: 2022-12-06 23:54:44
 */
function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

/*
 * @Author: Yanc
 * @Date: 2022-11-27 18:31:21
 * @LastEditTime: 2022-12-06 23:59:24
 */
const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    // #$data...
    // #
};
const publicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState, props } = instance;
        // setupState
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
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
 * @LastEditTime: 2022-12-07 00:26:07
 */
function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        emit: () => { },
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    //init slots
    initProps(instance, instance.vnode.props);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.vnode.type;
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
        // function  or  Object
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit,
        });
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
 * @LastEditTime: 2022-12-06 23:59:35
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
        // on + Event name 事件的命名规范
        const isOn = (key) => /^on[A-Z]/.test(key);
        if (isOn(key)) {
            const event = key.slice(2).toLowerCase();
            el.addEventListener(event, val);
        }
        else {
            el.setAttribute(key, val);
        }
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

export { createApp, h };
