/*
 * @Author: Yanc
 * @Date: 2022-11-27 16:25:26
 * @LastEditTime: 2022-11-27 17:03:20
 */
import { createApp } from "../../lib/guide-mini-vue.esm.js";
import { App } from "./App.js";

const rootContainer = document.querySelector("#app");
createApp(App).mount(rootContainer);
