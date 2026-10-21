import { test as base, expect } from '@playwright/test';
import { AuthPage } from './pages/AuthPage.js';
import { LabelsPage } from './pages/LabelsPage.js';
import { StatusesPage } from './pages/StatusesPage.js';
import { UsersPage } from './pages/UsersPage.js';
import { TasksPage } from './pages/TasksPage.js';
import { credentials, createTestData } from './data.js';

export const test = base.extend({
  authPage: async ({ page }, provide) => {
    const authPage = new AuthPage(page);
    await authPage.navigate();
    await provide(authPage);
  },

  authenticatedPage: async ({ authPage, page }, provide) => {
    await authPage.login(credentials.username, credentials.password);
    await page.waitForURL('**/#/');
    await provide(page);
  },

  labelsPage: async ({ authenticatedPage }, provide) => {
    const labelsPage = new LabelsPage(authenticatedPage);
    await labelsPage.navigate();
    await provide(labelsPage);
  },

  statusesPage: async ({ authenticatedPage }, provide) => {
    const statusesPage = new StatusesPage(authenticatedPage);
    await statusesPage.navigate();
    await provide(statusesPage);
  },

  usersPage: async ({ authenticatedPage }, provide) => {
    const usersPage = new UsersPage(authenticatedPage);
    await usersPage.navigate();
    await provide(usersPage);
  },

  tasksPage: async ({ authenticatedPage }, provide) => {
    const tasksPage = new TasksPage(authenticatedPage);
    await tasksPage.navigateToTasks();
    await provide(tasksPage);
  },

  // eslint-disable-next-line no-empty-pattern
  testData: async ({}, provide) => {
    await provide(createTestData());
  },
});

export { expect };
