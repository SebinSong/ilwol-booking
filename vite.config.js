import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const appSrc = path.resolve(__dirname, 'frontend/src')
const resolvePath = relPath => path.join(appSrc, relPath)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv('', process.cwd()) || {}
  for (const key in env) {
    env[key] = `"${env[key]}"`
  }

  return ({
    plugins: [react()],
    root: 'frontend',
    public: path.resolve(__dirname, 'frontend/public'),
    base: mode === 'staging' ? '/ilwol-booking/' : undefined,
    define: {
      '$TEST': '"test-string"',
      ...env
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
        '@store': resolvePath('store')
      }
    },
    build: {
      outDir: path.resolve(__dirname, './dist')
    }
  })
})
