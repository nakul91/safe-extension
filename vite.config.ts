import { crx, defineManifest, ManifestV3Export } from "@crxjs/vite-plugin";
import GlobalPolyFill from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import builtins from "rollup-plugin-node-builtins";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

import * as packageManifest from "./src/utils/config/manifest_v3.json";

const builtinsPlugin = builtins({ crypto: true });
builtinsPlugin.name = "builtins";

/* 
import * as packageManifest from "./src/utils/config/manifest_v3.json";
the above code was adding a new key called default which contains default key , 
but it is throwing error in chrome for adding unrecognized key default , 
the below  3 lines of code fixes that issue
*/
const manifestModified = { ...packageManifest, default: "" };
if (Object.keys(manifestModified)?.includes("default")) {
  delete manifestModified.default;
}

const manifestV3 = manifestModified as ManifestV3Export;

const manifest = defineManifest(manifestV3);

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
  build: {
    target: "ESNext",
    rollupOptions: {
      input: {
        app: resolve(__dirname, "popup.html"),
        content: resolve(__dirname, "./src/scripts/content.ts"),
        background: resolve(__dirname, "./src/scripts/background.ts"),
        injector: resolve(__dirname, "./src/scripts/injector.ts"),
        constants: resolve(__dirname, "./src/scripts/constants.ts"),
        broadcastChannelMessage: resolve(__dirname, "./src/scripts/message/broadcastChannelMessage.js"),
        portMessage: resolve(__dirname, "./src/scripts/message/portMessage.js"),
        index: resolve(__dirname, "./src/scripts/message/index.ts"),
        alertMessage: resolve(__dirname, "./src/scripts/backgroundServices/alertMessage.ts"),
      },
      output: {
        entryFileNames: `assets/[name].js`,
      },
      plugins: [
        rollupNodePolyFill({
          exclude: ["node_modules/@trustwallet/**"],
        }),
      ],
    },
  },
  plugins: [crx({ manifest }), react(), builtinsPlugin],
  server: {
    open: "/popup.html",
    port: 3000,
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
      // process: "process/browser",
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
