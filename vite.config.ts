import path from 'path'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { defineConfig, loadEnv, Plugin } from 'vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import preact from '@preact/preset-vite'

const excludeUnwantedCssPlugin = (): Plugin => {
  const excludePattern = /figma-colors|penpot-colors|penpot-types\.css$/

  return {
    name: 'exclude-unwanted-css',
    enforce: 'pre',

    resolveId(id, importer) {
      if (id.endsWith('.css')) {
        const testPath = importer
          ? path.resolve(path.dirname(importer), id)
          : id

        if (excludePattern.test(testPath))
          return { id: '\0empty-module', external: false }
      }
      return null
    },

    load(id) {
      if (id === '\0empty-module')
        return { code: 'export default ""', map: null }
      return null
    },

    transformIndexHtml(html) {
      return html.replace(/<style[^>]*>\s*<\/style>/g, '')
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDev = mode === 'development'
  const isPlugin = process.env.IS_PLUGIN === 'true'
  const plugin = process.env.PLUGIN || 'fig'
  const pluginDir = path.resolve(__dirname, plugin)

  return {
    plugins: [
      excludeUnwantedCssPlugin(),
      preact(),
      sentryVitePlugin({
        org: 'yelbolt',
        project: 'ui-color-palette',
        authToken: env.SENTRY_AUTH_TOKEN,
      }),
      viteSingleFile(),
    ],

    define: {
      __PLUGIN__: JSON.stringify(plugin),
    },

    resolve: {
      alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
        'react/jsx-runtime': 'preact/jsx-runtime',
        '@ui-lib': path.resolve(
          __dirname,
          './packages/ui-ui-color-palette/src'
        ),
      },
    },

    build: {
      target: 'es2015',
      sourcemap: isDev,
      minify: !isDev,
      outDir: path.resolve(pluginDir, 'dist'),
      watch: isDev ? {} : null,
      emptyOutDir: false,
      ...(isPlugin
        ? {
            lib: {
              entry: path.resolve(__dirname, './src/index.ts'),
              name: 'FigmaPlugin',
              fileName: () => 'plugin.js',
              formats: ['iife'],
            },
          }
        : {
            rollupOptions: {
              input: path.resolve(__dirname, './index.html'),
              output: {
                dir: path.resolve(pluginDir, 'dist'),
                entryFileNames: 'ui.js',
                assetFileNames: 'assets/[name].[hash][extname]',
              },
            },
          }),
    },
  }
})
