import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/mazic',

  server: {
    port: 4200,
    host: 'localhost',
    watch: {
      usePolling: true
    }
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [tsconfigPaths(), react({
    include: "**/*.tsx",
  })],

  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../dist/packages/mazic',
    reportCompressedSize: true,
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  // test: {
  //   globals: true,
  //   cache: {
  //     dir: '../../node_modules/.vitest',
  //   },
  //   environment: 'jsdom',
  //   include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

  //   reporters: ['default'],
  //   coverage: {
  //     reportsDirectory: '../../coverage/packages/mazic',
  //     provider: 'v8',
  //   },
  // },
});
