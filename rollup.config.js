/*
 * @Author: Yanc
 * @Date: 2022-11-27 16:27:25
 * @LastEditTime: 2022-11-27 17:13:27
 */

import typescript from "@rollup/plugin-typescript";

export default {
  input: "./src/index.ts",
  output: [
    // 1. cjs
    {
      format: "cjs",
      file: "lib/guide-mini-vue.cjs.js",
    },
    // 2. esm
    {
      format: "es",
      file: "lib/guide-mini-vue.esm.js",
    },
  ],
  plugins: [typescript()],
};
