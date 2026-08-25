import path from 'path'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { defineConfig, loadEnv } from 'vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import preact from '@preact/preset-vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDev = mode === 'development'
  const isPlugin = process.env.IS_PLUGIN === 'true'
  const plugin = process.env.PLUGIN || 'one'
  const pluginDir = path.resolve(__dirname, plugin)

  return {
    plugins: [
      preact(),
      viteSingleFile(),
      ...(!isDev
        ? [
            sentryVitePlugin({
              org: 'yelbolt',
              project: 'ui-color-palette',
              authToken: env.SENTRY_AUTH_TOKEN,
              sourcemaps: {
                assets: plugin === 'one' ? './one/dist/**' : './team/dist/**',
                filesToDeleteAfterUpload: isDev ? undefined : '**/*.map',
              },
              release: {
                name: env.VITE_APP_VERSION,
                setCommits: {
                  auto: true,
                },
                finalize: true,
                deploy: {
                  env: 'production',
                },
              },
              telemetry: false,
            }),
          ]
        : []),
    ],

    define: {
      __PLUGIN__: JSON.stringify(plugin),
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },

    optimizeDeps: {
      include: [
        'preact',
        'preact/hooks',
        'preact/compat',
        'preact/jsx-runtime',
        '@unoff/ui',
        '@unoff/utils',
      ],
    },

    resolve: {
      alias: {
        '@ui-lib': path.resolve(
          __dirname,
          './packages/ui-ui-color-palette/src'
        ),
      },
      preserveSymlinks: true,
    },

    build: {
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
      target: 'es2015',
      sourcemap: true,
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
              formats: ['iife' as const],
            },
          }
        : {
            rollupOptions: {
              input: path.resolve(__dirname, './index.html'),
              output: {
                dir: path.resolve(pluginDir, 'dist'),
                entryFileNames: 'ui.js',
                assetFileNames: 'assets/[name].[hash][extname]',
                sourcemapExcludeSources: false,
              },
            },
          }),
    },
  }
})
