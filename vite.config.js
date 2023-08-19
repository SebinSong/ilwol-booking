import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv('', process.cwd()) || {}
  for (const key in env) {
    env[key] = `"${env[key]}"`
  }

  console.log('loaded env: ', env)
  return ({
    plugins: [react()],
    root: 'frontend',
    public: path.resolve(__dirname, 'frontend/public'),
    define: {
      '$TEST': '"test-string"',
      ...env
    }
  })
})
