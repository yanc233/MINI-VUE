/*
 * @Author: Yanc
 * @Date: 2022-11-27 16:25:13
 * @LastEditTime: 2022-12-06 23:20:11
 */

import { h } from "../../lib/guide-mini-vue.esm.js";

export const App = {
  render() {
    console.log(this);
    return h("div", { id: "root" }, [
      h(
        "p",
        {
          class: "red",
          onClick() {
            console.log("click事件");
          },
        },
        "hi"
      ),
      h("p", { class: "blue" }, this.msg),
    ]);
  },
  setup() {
    return {
      msg: "mini-vue2",
    };
  },
};
