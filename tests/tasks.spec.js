import { test, expect } from './fixtures.js';
import { seedData, statusNames } from './data.js';

test.describe('Tasks and Kanban Board E2E Flow', () => {
  test('should successfully display kanban board and tasks', async ({ tasksPage }) => {
    await expect(tasksPage.taskCards).not.toHaveCount(0);
    await expect(tasksPage.kanbanColumn(seedData.status.name)).toBeVisible();
  });

  test('should successfully create a new task on the board', async ({ tasksPage, testData }) => {
    const task = testData.tasks.create;
    await tasksPage.openCreateForm();
    await tasksPage.saveTask(task.title, task.content, task.assignee, task.status);
    await tasksPage.navigateToTasks();

    await expect(tasksPage.taskInColumn(task.title, task.status)).toBeVisible();
  });

  test('should successfully filter tasks by status', async ({ tasksPage, testData }) => {
    const task = testData.tasks.filter;
    await tasksPage.openCreateForm();
    await tasksPage.saveTask(task.title, task.content, task.assignee, task.status);
    await tasksPage.navigateToTasks();
    await tasksPage.filterByStatus(task.status);

    await expect(tasksPage.taskInColumn(task.title, task.status)).toBeVisible();
    for (const statusName of statusNames) {
      if (statusName === task.status) {
        await expect(tasksPage.cardsInColumn(statusName)).not.toHaveCount(0);
      } else {
        await expect(tasksPage.cardsInColumn(statusName)).toHaveCount(0);
      }
    }
  });

  test('should successfully move task card between kanban columns via drag and drop', async ({ tasksPage }) => {
    const { title, sourceStatus, targetStatus } = seedData.movableTask;

    await expect(tasksPage.taskInColumn(title, sourceStatus)).toBeVisible();
    await tasksPage.moveTaskToNextColumn(title);

    await expect(tasksPage.taskInColumn(title, sourceStatus)).toHaveCount(0);
    await expect(tasksPage.taskInColumn(title, targetStatus)).toBeVisible();
  });

  test('should successfully edit an existing task', async ({ tasksPage, testData }) => {
    const task = testData.tasks.edit;
    const updatedTask = testData.tasks.updated;
    await tasksPage.openCreateForm();
    await tasksPage.saveTask(task.title, task.content, task.assignee, task.status);
    await tasksPage.navigateToTasks();
    await tasksPage.openEditForm(task.title);

    await tasksPage.saveTask(updatedTask.title, updatedTask.content);
    await tasksPage.navigateToTasks();

    await expect(tasksPage.taskCard(updatedTask.title)).toBeVisible();
    await expect(tasksPage.taskCard(task.title)).toHaveCount(0);
  });

  test('should successfully delete a task', async ({ tasksPage, testData }) => {
    const task = testData.tasks.delete;
    await tasksPage.openCreateForm();
    await tasksPage.saveTask(task.title, task.content, task.assignee, task.status);
    await tasksPage.navigateToTasks();

    await expect(tasksPage.taskCard(task.title)).toBeVisible();
    await tasksPage.deleteTask(task.title);

    await expect(tasksPage.taskCard(task.title)).toHaveCount(0);
  });
});
