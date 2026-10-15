import { test, expect } from '@playwright/test';

test('application renders successfully on the main page', async ({ page }) => {
  await page.goto('/');

  const rootElement = page.locator('#root');
  await expect(rootElement).toBeVisible();
});

test('application navigates to the login page', async ({ page }) => {
  await page.goto('/#/login');

  await expect(page).not.toHaveTitle(/404/);
});
