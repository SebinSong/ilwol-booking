const { defineConfig } = require("cypress")

module.exports = defineConfig({
  projectId: "frqnmb",
  viewportWidth: 1201,
  viewportHeight: 900,
  allowCypressEnv: false,
  fixturesFolder: 'test/cypress/fixtures',
  screenshotsFolder: 'test/cypress/screenshots',
  downloadsFolder: 'test/cypress/downloads',
  videosFolder: 'test/cypress/videos',
  defaultCommandTimeout: 15000,
  trashAssetsBeforeRuns: true,
  // Only capture video when recording (CI passes CYPRESS_RECORD_KEY via cypress.yml).
  video: Boolean(process.env.CYPRESS_RECORD_KEY),
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
