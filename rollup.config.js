import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import copy from 'rollup-plugin-copy'
import server from 'rollup-plugin-serve'
import replace from 'rollup-plugin-replace'
import vue from 'rollup-plugin-vue'
import eslint from '@rollup/plugin-eslint'
import scss from 'rollup-plugin-scss'
import alias from '@rollup/plugin-alias'
import livereload from 'rollup-plugin-livereload'
import prettier from 'rollup-plugin-prettier'
import dts from 'dts-bundle'
import path from 'path'
import pkg from './package.json'

const plugins = [resolve(), commonjs(), typescript()]

const isProd = process.env.NODE_ENV === 'production'

const outPath = 'dist'
const cwd = process.cwd()

const bundles = [
  {
    input: 'src/index.ts',
    output: {
      file: pkg.main,
      format: 'cjs',
    },
    plugins: [
      ...plugins,
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: [
          [
            '@babel/env',
            {
              modules: false,
              useBuiltIns: 'usage',
              targets: 'maintained node versions',
            },
          ],
        ],
      }),
      copy({
        targets: [
          {
            src: 'src/micro-app.d.ts',
            dest: outPath,
          },
        ],
      }),
      {
        name: 'generate-types',
        writeBundle() {
          dts.bundle({
            main: path.join(cwd, outPath, 'micro-app.d.ts'), // 入口地址
            name: pkg.name, // 声明模块
            removeSource: true, // 删除源文件
            out: path.join(cwd, outPath, 'micro-app-helper.d.ts'), // 合并后输出地址
          })
        },
      },
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'microAppBridge',
    },
    plugins: [
      ...plugins,
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.browser.replace('.js', '.min.js'),
      format: 'umd',
      name: 'microAppBridge',
    },
    plugins: [
      ...plugins,
      babel({
        exclude: 'node_modules/**',
      }),
      terser({
        compress: {
          pure_funcs: ['console.log'],
        },
        output: {
          comments: false,
        },
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.module,
      format: 'es',
    },
    plugins: [
      ...plugins,
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },
]

let port = 8080

function getConfig(basePath, plugin = []) {
  const dest = `${outPath}/${basePath}`
  return {
    input: `examples/${basePath}/index.ts`,
    output: {
      file: `${dest}/index.js`,
      format: 'iife',
    },
    plugins: [
      prettier({
        parser: 'babel',
      }),
      eslint(),
      vue({
        compilerOptions: {
          isCustomElement: (tag) => /^micro-app/.test(tag),
        },
      }),
      scss(),
      ...plugins,
      server({
        port: port++,
        contentBase: [dest],
        host: '0.0.0.0',
        historyApiFallback: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      copy({
        targets: [
          {
            src: 'examples/index.html',
            dest,
          },
          {
            src: 'examples/index.css',
            dest,
          },
        ],
      }),
      alias({
        entries: {
          vue: 'node_modules/vue/dist/vue.runtime.esm-browser.js',
        },
      }),
      ...plugin,
    ],
  }
}

export default isProd
  ? bundles
  : [getConfig('main-app', [livereload()]), getConfig('sub-app'), getConfig('sub-app2')]
