// rollup.config.js
import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import babelPlugin from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import resolve from '@rollup/plugin-node-resolve'; 
import json from '@rollup/plugin-json';
import dts from "rollup-plugin-dts";


const config = defineConfig([
  // 输出两种模式：ES Module和CommonJS
  {
    input: ["src/index.ts"],
    output: [
      {
        dir: "dist/esm",
        format: "esm",
        preserveModules: true, // 开启这个选项会将每个模块单独打包，有利于摇树优化
      },
      {
        dir: "dist/cjs",
        format: "cjs",
        preserveModules: true,
      },
    ],
    plugins: [
      typescript(),
      babelPlugin({ exclude: "**/node_modules/**" }),
      json(),
      resolve(),
      commonjs(),
    ],
  },
  // 打包类型声明
  {
    input: "src/index.ts",
    output: {
      dir: "dist/types",
      format: "esm",
      preserveModules: true,
    },
    plugins: [dts()],
  },
]);
export default config;
