import { test, expect } from '@playwright/test';

test.describe('Application Initial Loading and Layout', () => {

  test('application renders successfully on the main page with visible login form', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const usernameInput = page.locator('input[name="username"]');
    await expect(usernameInput).toBeVisible();

    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toBeVisible();

    const signInButton = page.locator('button[type="submit"]').or(page.getByRole('button'));
    await expect(signInButton.first()).toBeVisible();
  });

  test('application navigates to the login page and provides accessibility options', async ({ page }) => {
    await page.goto('/#/login');
    await page.waitForLoadState('networkidle');

    const usernameInput = page.locator('input[name="username"]').first();
    await expect(usernameInput).toBeEditable();
  });

});