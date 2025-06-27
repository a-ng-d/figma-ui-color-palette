import path from 'path'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { defineConfig, loadEnv } from 'vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import preact from '@preact/preset-vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDev = mode === 'development'
  const isPlugin = process.env.IS_PLUGIN === 'true'

  return {
    plugins: [
      preact(),
      sentryVitePlugin({
        org: 'yelbolt',
        project: 'ui-color-palette',
        authToken: env.SENTRY_AUTH_TOKEN,
      }),
      viteSingleFile(),
    ],

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
      outDir: 'dist',
      watch: isDev ? {} : null,
      emptyOutDir: false,
      ...(isPlugin
        ? {
            lib: {
              entry: 'src/index.ts',
              name: 'FigmaPlugin',
              fileName: () => 'plugin.js',
              formats: ['iife'],
            },
          }
        : {
            rollupOptions: {
              input: 'index.html',
              output: {
                dir: 'dist',
                entryFileNames: 'ui.js',
                assetFileNames: 'assets/[name].[hash][extname]',
              },
            },
          }),
    },
  }
})
