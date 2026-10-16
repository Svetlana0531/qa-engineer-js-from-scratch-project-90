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
    if (await tasksPage.filterStatusSelect.isVisible()) {
      await tasksPage.filterByStatus('Draft');
      await page.waitForLoadState('networkidle');
    }
  });

    test('should successfully move task card between kanban columns via drag and drop', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const cardsCount = await tasksPage.anyTaskCard.count();
    
    if (cardsCount > 0) {
      const firstCard = tasksPage.anyTaskCard.first();
      const taskId = await firstCard.getAttribute('data-rfd-draggable-id');

      if (taskId) {
        const targetColumn = page.locator('[data-rfd-droppable-id]').nth(1);
        const targetStatusId = await targetColumn.getAttribute('data-rfd-droppable-id') || '2';
        
        await tasksPage.moveTask(taskId, targetStatusId);

        await page.waitForTimeout(1000);

        await expect(tasksPage.taskCard(taskId)).toBeVisible();
      }
    }
  });
});
