import GlobalPolyFill from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
// import react from "@vitejs/plugin-react";
import { resolve } from "path";
import builtins from "rollup-plugin-node-builtins";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

const builtinsPlugin = builtins({ crypto: true });
builtinsPlugin.name = "builtins";

export default defineConfig({
  build: {
    target: "ES2020",
    minify: true,
    rollupOptions: {
      input: {
        injector: resolve(__dirname, "./src/scripts/safe-injector.ts"),
      },
      output: {
        entryFileNames: `safe-[name].js`,
        format: "iife",
        // sourcemap: process.env.minify !== "on",
      },
      // @ts-ignore
      plugins: [
        // @ts-ignore
        rollupNodePolyFill({
          exclude: ["node_modules/@trustwallet/**"],
        }),
      ],
    },
    outDir: "dist-script",
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      supported: { bigint: true },
      plugins: [
        GlobalPolyFill({
          process: true,
          buffer: false,
        }),
        NodeModulesPolyfillPlugin({}),
      ],
    },
  },
  resolve: {
    alias: {
      process: "process/browser",
      buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: "util",
      https: "agent-base",
      crypto: "crypto-browserify",
      "./runtimeConfig": "./runtimeConfig.browser",
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
});
