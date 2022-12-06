/*
 * @Author: Yanc
 * @Date: 2022-12-07 00:14:19
 * @LastEditTime: 2022-12-07 00:42:46
 */
export function emit(instance, event, ...args) {
  const { props } = instance;

  // 转驼峰
  const camelize = (str: string) => {
    return str.replace(/-(\w)/g, (_, c: string) => {
      return c ? c.toUpperCase() : "";
    });
  };

  // 首字母大写
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  // 转换名称
  const toHandlerKey = (str: string) => {
    return str ? "on" + capitalize(str) : "";
  };

  const handlerName = toHandlerKey(camelize(event));
  const hander = props[handlerName];

  hander && hander(...args);
}
