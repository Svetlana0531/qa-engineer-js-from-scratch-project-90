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
    const initialRowsCount = await statusesPage.tableRow.count();
    
    if (initialRowsCount > 0) {
      await statusesPage.rowCheckbox.first().click();
      await statusesPage.deleteButton.click();
      
      await page.waitForTimeout(1500); 

      const newRowsCount = await statusesPage.tableRow.count();
      expect(newRowsCount).toBeLessThan(initialRowsCount);
    }
  });

  test('should perform mass deletion of all statuses', async ({ page }) => {
    const rowsCount = await statusesPage.rowCheckbox.count();
    
    if (rowsCount > 0) {
      await statusesPage.selectAllCheckbox.click();

      const firstCheckboxChecked = await statusesPage.rowCheckbox.first().isChecked();
      expect(firstCheckboxChecked).toBe(true);

      await statusesPage.deleteButton.click();
      
      await page.waitForTimeout(2500); 

      const remainingRows = await statusesPage.rowCheckbox.count();
      expect(remainingRows).toBe(0);
    }
  });
});
