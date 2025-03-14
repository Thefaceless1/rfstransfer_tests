import { devices } from '@playwright/test';
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './src/tests',
  timeout: 300 * 1000,

  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['html', {outputFolder: 'src/artifacts/report',open: "never"}]],
  use: {
    screenshot : "only-on-failure",
    baseURL: (process.env.BRANCH == "preprod") ? "https://preprod-contract.platform.rfs.ru/" : "https://rfs-transfer-test.fors.ru/",
    headless: true,
    actionTimeout: 10000,
    trace: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
  outputDir: 'src/artifacts/screenshots'
};
export default config;
