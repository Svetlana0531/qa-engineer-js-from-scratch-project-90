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
    const firstRow = labelsPage.tableRow.first();
    await expect(firstRow).toBeVisible();

    const labelNameCell = firstRow.locator('td').nth(2); 
    const labelNameText = await labelNameCell.textContent();
    const deletedLabelName = labelNameText ? labelNameText.trim() : '';

    await labelsPage.rowCheckbox.first().click();
    await labelsPage.deleteButton.click();

    const tableBody = page.locator('tbody');
    await expect(tableBody).not.toContainText(deletedLabelName);
  });

  test('should perform mass deletion of all labels', async ({ page }) => {
    await expect(labelsPage.rowCheckbox.first()).toBeVisible();

    await labelsPage.selectAllCheckbox.click();
    await expect(labelsPage.rowCheckbox.first()).toBeChecked();

    await labelsPage.deleteButton.click();

    await expect(labelsPage.rowCheckbox).toHaveCount(0);
  });
});
