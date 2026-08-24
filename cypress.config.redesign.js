const { defineConfig } = require('cypress');

module.exports = defineConfig({
  video: true,
  env: {
    TEST_USER_LOGIN: 'user_test',
    TEST_USER_PASSWORD: 'AutoParts2026',
  },
  e2e: {
    baseUrl: 'https://lvtredesign.mstarproject.com',
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 10000,
    supportFile: "cypress/support/e2e.js",
  },
});
