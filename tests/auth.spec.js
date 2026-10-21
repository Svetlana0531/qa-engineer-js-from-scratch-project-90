import { test, expect } from './fixtures.js';
import { credentials } from './data.js';

test.describe('Authentication Flow', () => {
  test('should successfully log in with any credentials', async ({ authPage, page }) => {
    await authPage.login(credentials.username, credentials.password);

    await expect(page).toHaveURL(/#\/$/);
    await expect(authPage.profileButton).toBeVisible();
  });

  test('should successfully log out of the application', async ({ authPage, authenticatedPage }) => {
    await authPage.logout();

    await expect(authenticatedPage).toHaveURL(/#\/login/);
    await expect(authPage.usernameInput).toBeVisible();
  });
});
