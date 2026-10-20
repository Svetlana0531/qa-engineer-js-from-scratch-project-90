import { test, expect } from '@playwright/test';
import { AuthPage } from './pages/AuthPage.js';
import { TasksPage } from './pages/TasksPage.js';

test.describe('Tasks and Kanban Board E2E Flow', () => {
  let tasksPage;

  test.beforeEach(async ({ page }) => {
    const authPage = new AuthPage(page);
    tasksPage = new TasksPage(page);

    await authPage.navigate();
    await authPage.login('login', 'password');
    await page.waitForLoadState('networkidle');
    
    await tasksPage.navigateToTasks();
  });

  test('should successfully display kanban board and tasks', async ({ page }) => {
    await expect(tasksPage.anyTaskCard.first()).toBeVisible();
    
    await expect(page.locator('h6:has-text("Draft")').first()).toBeVisible();
  });

  test('should successfully create a new task on the board', async ({ page }) => {
    await tasksPage.openCreateForm();

    const uniqueTitle = `TaskTitle_${Date.now()}`;
    await tasksPage.createTask(uniqueTitle, 'Automated testing task content', 'john@google.com', 'Draft');

    await expect(page).toHaveURL(/#\/tasks/);
    await tasksPage.navigateToTasks();

    await expect(page.locator(`div:has-text("${uniqueTitle}")`).first()).toBeVisible();
  });

   test('should successfully filter tasks by status', async ({ page }) => {
  await page.goto('#/tasks');

  const targetStatus = 'Draft';
  await tasksPage.filterByStatus(targetStatus);
  await page.waitForURL(/filter/);
  await page.waitForLoadState('networkidle');

  const columnHeaders = page.locator('.RaList-content').locator('h6').filter({ hasNot: page.locator('#react-admin-title') });
  const columnsCount = await columnHeaders.count();

  for (let i = 0; i < columnsCount; i++) {
    const currentHeader = columnHeaders.nth(i);
    
    const columnNameText = await currentHeader.textContent();
    const columnName = columnNameText ? columnNameText.trim() : '';

    const currentColumnContainer = currentHeader.locator('xpath=..');
    const taskCardsInColumn = currentColumnContainer.locator('a[aria-label="Edit"]');
    const cardsCount = await taskCardsInColumn.count();

    if (columnName === targetStatus) {
      expect(cardsCount).toBeGreaterThan(0);
    } else {
      expect(cardsCount).toEqual(0);
    }
  }
  });

    test('should successfully move task card between kanban columns via drag and drop', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const cardsCount = await tasksPage.anyTaskCard.count();
    
    if (cardsCount > 0) {
      const firstCard = tasksPage.anyTaskCard.first();
      const taskId = await firstCard.getAttribute('data-rfd-draggable-id');

      if (taskId) {
        const specificCardLocator = page.locator(`[data-rfd-draggable-id="${taskId}"]`);
        
        const sourceColumnContainer = page.locator('[data-rfd-droppable-id]').filter({ has: specificCardLocator });
        const sourceStatusId = await sourceColumnContainer.getAttribute('data-rfd-droppable-id');

        const targetColumn = page.locator('[data-rfd-droppable-id]').nth(1);
        const targetStatusId = await targetColumn.getAttribute('data-rfd-droppable-id') || '2';
        
        await tasksPage.moveTask(taskId, targetStatusId);
    

        const finalSourceColumn = page.locator(`[data-rfd-droppable-id="${sourceStatusId}"]`);
        const finalTargetColumn = page.locator(`[data-rfd-droppable-id="${targetStatusId}"]`);

        await expect(finalSourceColumn.locator(`[data-rfd-draggable-id="${taskId}"]`)).not.toBeVisible();

        await expect(finalTargetColumn.locator(`[data-rfd-draggable-id="${taskId}"]`)).toBeVisible();
      }
    }
  });
      test('should successfully edit an existing task', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const cardsCount = await tasksPage.anyTaskCard.count();
    if (cardsCount > 0) {
      const firstCard = tasksPage.anyTaskCard.first();
      const taskId = await firstCard.getAttribute('data-rfd-draggable-id');

      if (taskId) {
        await tasksPage.openEditForm(taskId); 

        const updatedTitle = `UpdatedTitle_${Date.now()}`;
        
        await tasksPage.updateTask(updatedTitle, 'Updated task description');

        await tasksPage.navigateToTasks();
        await expect(page.locator(`div:has-text("${updatedTitle}")`).first()).toBeVisible();
      }
    }
  });

  test('should successfully delete a task', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const cardsCount = await tasksPage.anyTaskCard.count();
    if (cardsCount > 0) {
      const firstCard = tasksPage.anyTaskCard.first();
      const taskId = await firstCard.getAttribute('data-rfd-draggable-id');
      const taskText = await firstCard.innerText();

      if (taskId) {
        await tasksPage.deleteTask(taskId);

        await page.waitForLoadState('networkidle');
        await expect(tasksPage.taskCard(taskId)).not.toBeVisible();
      }
    }
  });
});
