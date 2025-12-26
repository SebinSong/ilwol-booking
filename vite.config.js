import path, { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const appSrc = path.resolve(__dirname, 'frontend/src')
const resolvePath = relPath => path.join(appSrc, relPath)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, './env') || {}
  const env_repl = {}

  for (const key in env) {
    env_repl[key] = `"${env[key]}"`
  }

  return ({
    plugins: [react()],
    root: 'frontend',
    public: path.resolve(__dirname, 'frontend/public'),
    base: mode === 'staging' ? '/ilwol-booking/' : undefined,
    define: {
      '$TEST': '"test-string"',
      '$IS_APP': process.env.IS_APP ? JSON.stringify(process.env.IS_APP) : '""',
      '$MOBILE_API_URL': process.env.IS_APP ? JSON.stringify(env.VITE_MOBILE_API_URL || '') : '""',
      ...env_repl
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          loadPaths: [ resolvePath('styles') ],
          additionalData: '@use "global_scss_utils" as *;'
        }
      }
    },
    resolve: {
      alias: {
        '~': appSrc,
        '@components': resolvePath('components'),
        '@pages': resolvePath('pages'),
        '@utils': resolvePath('utilities.jsx'),
        '@view-data': resolvePath('view-data'),
        '@styles': resolvePath('styles'),
        '@store': resolvePath('store'),
        '@hooks': resolvePath('hooks')
      }
    },
    build: {
      outDir: path.resolve(__dirname, './dist'),
      rollupOptions: {
        output: {
          manualChunks: {
            'third-parties': [
              'react',
              'react-dom',
              'react-redux',
              'react-router-dom',
              'react-calendar',
              '@reduxjs/toolkit',
              'use-immer',
              'dayjs'
            ]
          }
        }
      }
    },
    server: {
      // dev-server configuration
      proxy: {
        '/api': `http://127.0.0.1:${env.VITE_DEV_API_PORT}`
      }
    }
  })
})
