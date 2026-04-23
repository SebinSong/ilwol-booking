const { defineConfig } = require("cypress")

module.exports = defineConfig({
  viewportWidth: 1201,
  viewportHeight: 900,
  allowCypressEnv: false,
  fixturesFolder: 'test/cypress/fixtures',
  screenshotsFolder: 'test/cypress/screenshots',
  downloadsFolder: 'test/cypress/downloads',
  videosFolder: 'test/cypress/videos',
  defaultCommandTimeout: 15000,
  video: true,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:5173',
    specPattern: 'test/cypress/e2e/**/*.{js,ts,jsx,tsx}',
    supportFile: 'test/cypress/support/index.js',
    testIsolation: true,
    experimentalRunAllSpecs: true
  }
})
