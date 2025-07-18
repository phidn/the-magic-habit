import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import circleDependency from "vite-plugin-circular-dependency";

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/mazic',

  envPrefix: 'VITE',

  server: {
    port: 4200,
    host: 'localhost',
    watch: {
      usePolling: true,
    },
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    tsconfigPaths(),
    react({
      include: '**/*.tsx',
    }),
    circleDependency(),
  ],

  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },

  build: {
    outDir: '../../dist/packages/mazic',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === 'SOURCEMAP_ERROR') {
          return
        }
        defaultHandler(warning)
      },
    },
  },
})
