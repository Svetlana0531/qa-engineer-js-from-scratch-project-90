import { test, expect } from '@playwright/test';
import { AuthPage } from './pages/AuthPage.js';
import { LabelsPage } from './pages/LabelsPage.js';

test.describe('Labels Management CRUD Flow', () => {
  let labelsPage;

  test.beforeEach(async ({ page }) => {
    const authPage = new AuthPage(page);
    labelsPage = new LabelsPage(page);

    await authPage.navigate();
    await authPage.login('login', 'password');
    await page.waitForLoadState('networkidle');
    
    await labelsPage.navigateToLabels();
  });

  test('should successfully display labels list with Name column', async ({ page }) => {
    await expect(labelsPage.tableRow.first()).toBeVisible();

    const tableHeader = page.locator('thead');
    await expect(tableHeader).toContainText(/Name/i);
  });

  test('should successfully create a new label', async ({ page }) => {
    await labelsPage.openCreateForm();

    await expect(labelsPage.nameInput).toBeVisible();

    const uniqueLabelName = `Label_${Date.now()}`;
    await labelsPage.createLabel(uniqueLabelName);

    await expect(page).toHaveURL(/.*(label|tag).*/);
    
    await labelsPage.navigateToLabels();
    await expect(page.locator(`tbody:has-text("${uniqueLabelName}")`)).toBeVisible();
  });

  test('should successfully edit label name', async ({ page }) => {
    await labelsPage.openEditFormOfFirstLabel();

    const updatedLabelName = `UpdatedLabel_${Date.now()}`;
    await labelsPage.editLabel(updatedLabelName);

    await page.waitForLoadState('networkidle');
    await labelsPage.navigateToLabels();
    await expect(page.locator(`tbody:has-text("${updatedLabelName}")`)).toBeVisible();
  });

  test('should delete a single label via row checkbox', async ({ page }) => {
    const initialRowsCount = await labelsPage.tableRow.count();
    
    if (initialRowsCount > 0) {
      await labelsPage.rowCheckbox.first().click();
      await labelsPage.deleteButton.click();
      
      await page.waitForTimeout(1500); 

      const newRowsCount = await labelsPage.tableRow.count();
      expect(newRowsCount).toBeLessThan(initialRowsCount);
    }
  });

  test('should perform mass deletion of all labels', async ({ page }) => {
    const rowsCount = await labelsPage.rowCheckbox.count();
    
    if (rowsCount > 0) {
      await labelsPage.selectAllCheckbox.click();

      const firstCheckboxChecked = await labelsPage.rowCheckbox.first().isChecked();
      expect(firstCheckboxChecked).toBe(true);

      await labelsPage.deleteButton.click();
      await page.waitForTimeout(2500); 

      const remainingRows = await labelsPage.rowCheckbox.count();
      expect(remainingRows).toBe(0);
    }
  });
});
