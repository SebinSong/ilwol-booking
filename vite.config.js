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

  console.log('envs: ', env)
  return ({
    plugins: [react()],
    root: 'frontend',
    public: path.resolve(__dirname, 'frontend/public'),
    base: mode === 'staging' ? '/ilwol-booking/' : undefined,
    define: {
      '$TEST': '"test-string"',
      ...env_repl
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: [ resolvePath('styles') ],
          additionalData: '@import "variables";'
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
      outDir: path.resolve(__dirname, './dist')
    },
    server: {
      // dev-server configuration
      proxy: {
        '/api': `http://127.0.0.1:${env.VITE_DEV_API_PORT}`
      }
    }
  })
})
