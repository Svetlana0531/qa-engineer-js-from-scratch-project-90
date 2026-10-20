import { test, expect } from '@playwright/test';
import { AuthPage } from './pages/AuthPage.js';
import { UsersPage } from './pages/UsersPage.js';

test.describe('Login Negative Scenarios', () => {
  let authPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.navigate();
  });

  test('should show validation error when trying to login with an empty form', async ({ page }) => {
    await page.locator('button[type="submit"]').click();

    const errorText = page.locator(':text("Required"), :text("Обязательное поле")');
    await expect(errorText.first()).toBeVisible();
  });

  test('should show validation error when username is missing', async ({ page }) => {
    await page.locator('input[name="password"]').fill('any-password');
    await page.locator('button[type="submit"]').click();

    const errorText = page.locator(':text("Required"), :text("Обязательное поле")');
    await expect(errorText.first()).toBeVisible();
  });
});

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

  test('should not create a user with an empty form because save button is disabled', async ({ page }) => {
    await usersPage.openCreateForm();

    await expect(usersPage.saveButton).toBeDisabled();

    await expect(page).toHaveURL(/#\/users\/create/);
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

  test('should cancel single user deletion via undo notification', async ({ page }) => {
    const firstRow = usersPage.tableRow.first();
    await expect(firstRow).toBeVisible();

    const emailText = await firstRow.locator('td').filter({ hasText: '@' }).first().textContent();
    const targetUserEmail = emailText ? emailText.trim() : '';

    await usersPage.rowCheckbox.first().click();
    await usersPage.deleteButton.click();

    const undoButton = page.locator('button:has-text("Undo"), button:has-text("Отменить")').first();
    await undoButton.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    
    if (await undoButton.isVisible()) {
      await undoButton.click();
    }

    await page.waitForLoadState('networkidle');

    const tableBody = page.locator('tbody');
    await expect(tableBody).toContainText(targetUserEmail);
  });

  test('should delete a single user via row checkbox', async ({ page }) => {
    const firstRow = usersPage.tableRow.first();
    await expect(firstRow).toBeVisible();

    const emailText = await firstRow.locator('td').filter({ hasText: '@' }).first().textContent();
    const deletedUserEmail = emailText ? emailText.trim() : '';

    await usersPage.rowCheckbox.first().click();
    await usersPage.deleteButton.click();

    const tableBody = page.locator('tbody');
    await expect(tableBody).not.toContainText(deletedUserEmail);
  });

  test('should perform mass deletion of all users', async () => {
    await expect(usersPage.rowCheckbox.first()).toBeVisible();

    await usersPage.selectAllCheckbox.click();
    await expect(usersPage.rowCheckbox.first()).toBeChecked();

    await usersPage.deleteButton.click();

    await expect(usersPage.rowCheckbox).toHaveCount(0);
  });
});
