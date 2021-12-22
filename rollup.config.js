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
import pkg from './package.json'

const commonPlugins = [resolve(), commonjs(), typescript()]

const isProd = process.env.NODE_ENV === 'production'

const outPath = 'dist'

const getBundles = (_plugins) => {
  const plugins = commonPlugins.concat(_plugins)
  return [
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
        ...plugins,
      ],
    },
    {
      input: 'src/index.ts',
      output: {
        file: pkg.browser,
        format: 'umd',
        name: 'Calculater',
        inlineDynamicImports: true,
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
        name: 'Calculater',
        inlineDynamicImports: true,
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
}

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
      vue(),
      scss(),
      ...commonPlugins,
      server({
        port: port++,
        contentBase: [dest, outPath],
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

export default async (argv) => {
  const modules = {
    // all modules
    'process.env.MODULE_MULTIPLY': JSON.stringify(false),
    'process.env.MODULE_DIVIDE': JSON.stringify(false),
  }
  if (typeof argv.module === 'string') {
    argv.module = argv.module.split(',')
  }
  argv.module?.forEach(
    (name) => (modules[`process.env.MODULE_${name.toUpperCase()}`] = JSON.stringify(true))
  )
  const plugins = [replace(modules)]

  return isProd
    ? getBundles(plugins)
    : [getConfig('main', [livereload()]), getBundles(plugins)[1] /** umd */]
}
