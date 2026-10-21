import { test, expect } from './fixtures.js';
import { seedData } from './data.js';

test.describe('Labels Management CRUD Flow', () => {
  test('should successfully display labels list with Name column', async ({ labelsPage }) => {
    await expect(labelsPage.nameColumnHeader).toBeVisible();

    const label = labelsPage.getRowCells(seedData.label.id);
    await expect(label.name).toHaveText(seedData.label.name);
  });

  test('should successfully create a new label', async ({ labelsPage, page, testData }) => {
    await labelsPage.openCreateForm();
    await expect(labelsPage.nameInput).toBeVisible();

    await labelsPage.createLabel(testData.label.name);

    await expect(page).toHaveURL(/.*(label|tag).*/);
    await labelsPage.navigate();
    await expect(labelsPage.getCell(testData.label.name)).toBeVisible();
  });

  test('should successfully edit label name', async ({ labelsPage, testData }) => {
    await labelsPage.openEditFormOfFirstRow();
    await labelsPage.editLabel(testData.label.updatedName);

    await labelsPage.navigate();
    await expect(labelsPage.getCell(testData.label.updatedName)).toBeVisible();
  });

  test('should delete a single label via row checkbox', async ({ labelsPage }) => {
    await expect(labelsPage.firstRow).toBeVisible();
    await expect(labelsPage.firstRowValueCell).toHaveText(seedData.label.name);

    await labelsPage.selectFirstRow();
    await labelsPage.deleteSelectedRows();

    await expect(labelsPage.getCell(seedData.label.name)).not.toBeVisible();
  });

  test('should perform mass deletion of all labels', async ({ labelsPage }) => {
    await expect(labelsPage.firstRowCheckbox).toBeVisible();

    await labelsPage.selectAllRows();
    await expect(labelsPage.firstRowCheckbox).toBeChecked();

    await labelsPage.deleteSelectedRows();

    await expect(labelsPage.rowCheckbox).toHaveCount(0);
  });
});
