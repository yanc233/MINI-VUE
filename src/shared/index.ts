/*
 * @Author: Yanc
 * @Date: 2022-10-30 23:38:16
 * @LastEditTime: 2022-11-03 00:51:51
 */
export const extend = Object.assign;

export const hasChanged = (val, newValue) => {
  return !Object.is(val, newValue);
};

export const isObject = (val) => {
  return val !== null && typeof val === "object";
};
