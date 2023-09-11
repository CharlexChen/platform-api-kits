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
        exports: "named", // 指定导出模式（自动、默认、命名、无）
        preserveModules: false, // 保留模块结构
        // preserveModulesRoot: "src", // 将保留的模块放在根级别的此路径下
      },
      {
        dir: "dist/cjs",
        format: "cjs",
        exports: "named", // 指定导出模式（自动、默认、命名、无）
        preserveModules: false, // 保留模块结构
        // preserveModulesRoot: "src", // 将保留的模块放在根级别的此路径下
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      babelPlugin({ exclude: "**/node_modules/**" }),
      json(),
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
