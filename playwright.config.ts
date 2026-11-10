import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  timeout: 30000,
  use: {
    baseURL: process.env.TEST_ORIGIN ?? 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
    reducedMotion: 'reduce',
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-webkit', use: { ...devices['iPhone 13'] } },
  ],
  webServer: process.env.TEST_ORIGIN
    ? undefined
    : {
        command: 'pnpm preview',
        url: 'http://127.0.0.1:4321',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      },
});
