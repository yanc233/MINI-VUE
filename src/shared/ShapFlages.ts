/*
 * @Author: Yanc
 * @Date: 2022-12-06 22:41:46
 * @LastEditTime: 2022-12-06 22:44:58
 */
export const enum ShapeFlags {
  ELEMENT = 1, // 0001
  STATEFUL_COMPONENT = 1 << 1, // 0010
  TEXT_CHILDREN = 1 << 2, // 0100
  ARRAY_CHILDREN = 1 << 3, //1000
}
