import { test, expect } from './fixtures.js';
import { seedData } from './data.js';

test.describe('Statuses Management CRUD Flow', () => {
  test('should successfully display statuses list with required columns', async ({ statusesPage }) => {
    await expect(statusesPage.nameColumnHeader).toBeVisible();
    await expect(statusesPage.slugColumnHeader).toBeVisible();

    const status = statusesPage.getRowCells(seedData.status.id);
    await expect(status.name).toHaveText(seedData.status.name);
    await expect(status.slug).toHaveText(seedData.status.slug);
  });

  test('should successfully create a new status', async ({ statusesPage, page, testData }) => {
    await statusesPage.openCreateForm();
    await statusesPage.createStatus(testData.status.name, testData.status.slug);

    await expect(page).toHaveURL(/.*status.*/);
    await statusesPage.navigate();
    await expect(statusesPage.getCell(testData.status.name)).toBeVisible();
    await expect(statusesPage.getCell(testData.status.slug)).toBeVisible();
  });

  test('should successfully edit status data', async ({ statusesPage, testData }) => {
    await statusesPage.openEditFormOfFirstRow();
    await statusesPage.editStatus({ name: testData.status.updatedName });

    await statusesPage.navigate();
    await expect(statusesPage.getCell(testData.status.updatedName)).toBeVisible();
  });

  test('should delete a single status via row checkbox', async ({ statusesPage }) => {
    await expect(statusesPage.firstRow).toBeVisible();
    await expect(statusesPage.firstRowValueCell).toHaveText(seedData.status.name);

    await statusesPage.selectFirstRow();
    await statusesPage.deleteSelectedRows();

    await expect(statusesPage.getCell(seedData.status.name)).not.toBeVisible();
  });

  test('should perform mass deletion of all statuses', async ({ statusesPage }) => {
    await expect(statusesPage.firstRowCheckbox).toBeVisible();

    await statusesPage.selectAllRows();
    await expect(statusesPage.firstRowCheckbox).toBeChecked();

    await statusesPage.deleteSelectedRows();

    await expect(statusesPage.rowCheckbox).toHaveCount(0);
  });
});
