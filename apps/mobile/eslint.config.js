const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const sharedConfig = require('@solar-system/config/eslint/base');

module.exports = defineConfig([
  ...sharedConfig,
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);
