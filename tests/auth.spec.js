import { test, expect } from '@playwright/test';
import { AuthPage } from './pages/AuthPage.js';

test.describe('Authentication Flow', () => {

  test('should successfully log in with any credentials', async ({ page }) => {
    const authPage = new AuthPage(page);

    await authPage.navigate();
    await authPage.login('admin', 'admin');

    await expect(page).toHaveURL(/#\/$/); 

    await expect(authPage.profileButton).toBeVisible();
  });

  test('should successfully log out of the application', async ({ page }) => {
    const authPage = new AuthPage(page);

    await authPage.navigate();
    await authPage.login('admin', 'admin');
    
    await authPage.logout();

    await expect(page).toHaveURL(/#\/login/);
    await expect(authPage.usernameInput).toBeVisible();
  });

});
