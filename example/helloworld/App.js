/*
 * @Author: Yanc
 * @Date: 2022-11-27 16:25:13
 * @LastEditTime: 2022-12-07 00:08:29
 */

import { h } from "../../lib/guide-mini-vue.esm.js";

import { Foo } from "./Foo.js";

export const App = {
  name: "app",
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
      h(Foo, {
        count: 1,
        onAdd() {
          console.log("onAdd");
        },
      }),
    ]);
  },
  setup() {
    return {
      msg: "mini-vue2",
    };
  },
};
