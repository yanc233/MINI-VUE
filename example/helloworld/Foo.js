/*
 * @Author: Yanc
 * @Date: 2022-12-06 23:25:37
 * @LastEditTime: 2022-12-07 00:08:45
 */

import { h } from "../../lib/guide-mini-vue.esm.js";
export const Foo = {
  setup(props, { emit }) {
    const emitAdd = () => {
      emit("add");
      console.log("emit add");
    };
    // 2 readonly
    props.count = 3;
    return {
      emitAdd,
    };
  },
  render() {
    const btn = h(
      "button",
      {
        onClick: this.emitAdd,
      },
      "emitAdd"
    );
    const foo = h("div", {}, "foo " + this.count);
    // 3. render中可以通过this访问props中的值
    return h("div", {}, [btn, foo]);
  },
};
