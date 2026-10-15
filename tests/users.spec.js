import { test, expect } from '@playwright/test';
import { AuthPage } from './pages/AuthPage.js';
import { UsersPage } from './pages/UsersPage.js';

test.describe('Users Management CRUD Flow', () => {
  let usersPage;

  test.beforeEach(async ({ page }) => {
    const authPage = new AuthPage(page);
    usersPage = new UsersPage(page);

    await authPage.navigate();
    await authPage.login('login', 'password');
    await page.waitForLoadState('networkidle');
    
    await usersPage.navigateToUsers();
  });

  test('should successfully display users list with required columns', async ({ page }) => {
    await expect(usersPage.tableRow.first()).toBeVisible();

    const tableHeader = page.locator('thead');
    await expect(tableHeader).toContainText(/First name/i);
    await expect(tableHeader).toContainText(/Last name/i);
    await expect(tableHeader).toContainText(/Email/i);
  });

    test('should successfully create a new user', async ({ page }) => {
    await usersPage.openCreateForm();

    await expect(usersPage.firstNameInput).toBeVisible();
    await expect(usersPage.emailInput).toBeVisible();

    const email = `test_${Date.now()}@hexlet.io`;
    await usersPage.createUser('John', 'Doe', email);

    await expect(page).toHaveURL(/#\/users/);

    await usersPage.navigateToUsers();
    await expect(page.locator(`tbody:has-text("${email}")`)).toBeVisible();
  });


  test('should edit user data and validate email field', async ({ page }) => {
    await usersPage.openEditFormOfFirstUser();

    await usersPage.emailInput.fill('invalid-email-format');
    await usersPage.saveButton.click();
    
    await expect(usersPage.emailError.first()).toBeVisible();

    const updatedEmail = `updated_${Date.now()}@hexlet.io`;
    await usersPage.editUser({ firstName: 'Alex', email: updatedEmail });

    await page.waitForLoadState('networkidle');
    await expect(page.locator(`tbody:has-text("${updatedEmail}")`)).toBeVisible();
  });

  test('should delete a single user via row checkbox', async ({ page }) => {
    const initialRowsCount = await usersPage.tableRow.count();
    
    if (initialRowsCount > 0) {
      await usersPage.rowCheckbox.first().click();
      await usersPage.deleteButton.click();
      
      await page.waitForTimeout(1000); 

      const newRowsCount = await usersPage.tableRow.count();
      expect(newRowsCount).toBeLessThan(initialRowsCount);
    }
  });

  test('should perform mass deletion of all users', async ({ page }) => {
    const rowsCount = await usersPage.rowCheckbox.count();
    
    if (rowsCount > 0) {
      await usersPage.selectAllCheckbox.click();

      const firstCheckboxChecked = await usersPage.rowCheckbox.first().isChecked();
      expect(firstCheckboxChecked).toBe(true);

      await usersPage.deleteButton.click();
      
      await page.waitForTimeout(2000); 

      const remainingRows = await usersPage.rowCheckbox.count();
      expect(remainingRows).toBe(0);
    }
  });
});
