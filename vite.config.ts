import { defineConfig, ConfigEnv, UserConfigExport } from 'vite'
import react from '@vitejs/plugin-react'
// import reactRefresh from "@vitejs/plugin-react-refresh";

// import { createStyleImportPlugin, AntdResolve } from "vite-plugin-style-import";
import styleImport, { AntdResolve } from 'vite-plugin-style-import'
import { resolve } from 'path'
// svg自定义配置
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// 为不支持原生 ESM 的旧版浏览器提供支持
import legacy from '@vitejs/plugin-legacy'

// 让 vite 能够使用 TypeScript 的路径映射解析导入
import tsconfigPaths from 'vite-tsconfig-paths'

import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
  const root = process.cwd()
  return defineConfig({
    root,
    base: command === 'serve' ? '/' : '/vite-react-admin',
    plugins: [
      tsconfigPaths(),
      react(),
      styleImport({
        resolves: [AntdResolve()]
      }),
      // svg配置
      createSvgIconsPlugin({
        iconDirs: [resolve(root, 'src/assets/svg')],
        symbolId: 'svg-[dir]-[name]'
      }),
      legacy({ targets: ['defaults', 'not IE 11'] }),
      // mock
      viteMockServe({
        supportTs: true,
        mockPath: './src/mocks',
        logger: true,
        localEnabled: command === 'serve',
        prodEnabled: command !== 'serve',
        injectCode: `
            import { initMockServer } from './src/mocks.ts';
            initMockServer();
          `
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/styles/common.scss";`
        },
        less: {
          javascriptEnabled: true
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve('src'),
        '#': resolve('typings')
      }
    },
    server: {
      port: 3001,
      open: false,
      proxy: {
        '/api': {
          target: 'http://192.168.200.239/official/api',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp('^/api'), '')
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 500
    }
    /* esbuild: {
      jsxInject: `import React from 'react'`
    } */
  })
}
