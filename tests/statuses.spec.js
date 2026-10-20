import { test, expect } from '@playwright/test';
import { AuthPage } from './pages/AuthPage.js';
import { StatusesPage } from './pages/StatusesPage.js';

test.describe('Statuses Management CRUD Flow', () => {
  let statusesPage;

  test.beforeEach(async ({ page }) => {
    const authPage = new AuthPage(page);
    statusesPage = new StatusesPage(page);

    await authPage.navigate();
    await authPage.login('login', 'password');
    await page.waitForLoadState('networkidle');
    
    await statusesPage.navigateToStatuses();
  });

  test('should successfully display statuses list with required columns', async ({ page }) => {
    await expect(statusesPage.tableRow.first()).toBeVisible();

    const tableHeader = page.locator('thead');
    await expect(tableHeader).toContainText(/Name/i);
    await expect(tableHeader).toContainText(/Slug/i);
  });

   test('should successfully create a new status', async ({ page }) => {
    await statusesPage.openCreateForm();

    const uniqueValue = Date.now();
    const statusName = `Status_${uniqueValue}`;
    const statusSlug = `slug_${uniqueValue}`;

    await statusesPage.createStatus(statusName, statusSlug);

    await expect(page).toHaveURL(/.*status.*/);

    await statusesPage.navigateToStatuses();
    await expect(page.locator(`tbody:has-text("${statusName}")`)).toBeVisible();
    await expect(page.locator(`tbody:has-text("${statusSlug}")`)).toBeVisible();
  });

  test('should successfully edit status data', async ({ page }) => {
    await statusesPage.openEditFormOfFirstStatus();

    const updatedName = `UpdatedStatus_${Date.now()}`;
    await statusesPage.editStatus({ name: updatedName });

    await page.waitForLoadState('networkidle');
    await statusesPage.navigateToStatuses();
    await expect(page.locator(`tbody:has-text("${updatedName}")`)).toBeVisible();
  });

  test('should delete a single status via row checkbox', async ({ page }) => {
    const firstRow = statusesPage.tableRow.first();
    await expect(firstRow).toBeVisible();

    const statusNameText = await firstRow.locator('td').nth(2).textContent();
    const deletedStatusName = statusNameText ? statusNameText.trim() : '';

    await statusesPage.rowCheckbox.first().click();
    await statusesPage.deleteButton.click();

    const tableBody = page.locator('tbody');
    await expect(tableBody).not.toContainText(deletedStatusName);
  });

  test('should perform mass deletion of all statuses', async ({ page }) => {
    await expect(statusesPage.rowCheckbox.first()).toBeVisible();

    await statusesPage.selectAllCheckbox.click();
    await expect(statusesPage.rowCheckbox.first()).toBeChecked();

    await statusesPage.deleteButton.click();

    await expect(statusesPage.rowCheckbox).toHaveCount(0);
  });
});
