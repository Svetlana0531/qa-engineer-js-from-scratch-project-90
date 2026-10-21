export class TasksPage {
  constructor(page) {
    this.page = page;
    this.tasksMenuButton = page.getByRole('menuitem', { name: 'Tasks', exact: true });
    this.createButton = page.getByRole('link', { name: 'Create', exact: true });
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
    this.deleteButton = page.getByRole('button', { name: 'Delete', exact: true });
    this.titleInput = page.getByRole('textbox', { name: 'Title', exact: true });
    this.contentInput = page.getByRole('textbox', { name: 'Content', exact: true });
    this.assigneeSelect = page.getByRole('combobox', { name: /^Assignee\b/ });
    this.statusSelect = page.getByRole('combobox', { name: /^Status\b/ });
    this.taskCards = page.getByRole('button').filter({
      has: page.getByRole('link', { name: 'Edit', exact: true }),
    });
  }

  taskCard(title) {
    return this.taskCards.filter({ has: this.page.getByText(title, { exact: true }) });
  }

  kanbanColumn(statusName) {
    return this.page.getByText(statusName, { exact: true })
      .and(this.page.locator(':not([role="combobox"])'))
      .locator('..');
  }

  cardsInColumn(statusName) {
    return this.kanbanColumn(statusName).getByRole('button');
  }

  taskInColumn(title, statusName) {
    return this.cardsInColumn(statusName).filter({
      has: this.page.getByText(title, { exact: true }),
    });
  }

  async navigateToTasks() {
    await this.tasksMenuButton.click();
    await this.createButton.waitFor({ state: 'visible' });
    await this.page.waitForLoadState('networkidle');
  }

  async openCreateForm() {
    await this.createButton.click();
    await this.titleInput.waitFor({ state: 'visible' });
  }

  async saveTask(title, content, assigneeName = null, statusName = null) {
    await this.titleInput.fill(title);
    await this.contentInput.fill(content);

    if (assigneeName) {
      await this.assigneeSelect.click();
      await this.page.getByRole('option', { name: assigneeName, exact: true }).click();
    }

    if (statusName) {
      await this.statusSelect.click();
      await this.page.getByRole('option', { name: statusName, exact: true }).click();
    }

    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async filterByStatus(statusName) {
    await this.statusSelect.click();
    await this.page.getByRole('option', { name: statusName, exact: true }).click();
    await this.page.waitForURL(/filter/);
    await this.page.waitForLoadState('networkidle');
  }

  async moveTaskToNextColumn(title) {
    const sourceCard = this.taskCard(title);
    await sourceCard.focus();
    await sourceCard.press('Space');
    await sourceCard.press('ArrowRight');
    await sourceCard.press('Space');
    await this.page.waitForLoadState('networkidle');
  }

  async openEditForm(title) {
    await this.taskCard(title).getByRole('link', { name: 'Edit', exact: true }).click();
    await this.titleInput.waitFor({ state: 'visible' });
  }

  async deleteTask(title) {
    await this.openEditForm(title);
    await this.deleteButton.click();
    await this.createButton.waitFor({ state: 'visible' });
  }
}
