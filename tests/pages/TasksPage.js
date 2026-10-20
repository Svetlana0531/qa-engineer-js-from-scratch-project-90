export class TasksPage {
  constructor(page) {
    this.page = page;

    this.tasksMenuButton = page.locator('a[role="menuitem"][href="#/tasks"]')
      .or(page.locator('a[href="#/tasks"]'))
      .or(page.locator('[role="menuitem"]:has-text("Tasks")'))
      .first();

    this.createButton = page.locator('.RaList-actions a[href="#/tasks/create"]')
      .or(page.locator('a[href="#/tasks/create"]')).first();
    this.saveButton = page.locator('button[type="submit"]', { hasText: 'Save' });

    this.titleInput = page.locator('input[name="title"]');
    this.contentInput = page.locator('textarea[name="content"]');
    this.assigneeSelect = page.locator('.ra-input-assignee_id [role="combobox"]');
    this.statusSelect = page.locator('.ra-input-status_id [role="combobox"]');

    this.kanbanColumn = (statusId) => page.locator(`[data-rfd-droppable-id="${statusId}"]`);
    this.taskCard = (taskId) => page.locator(`[data-rfd-draggable-id="${taskId}"]`);
    this.anyTaskCard = page.locator('[data-rfd-draggable-id]');

    this.filterStatusSelect = page.locator('.ra-input-status_id [role="combobox"], [data-source="status_id"] [role="combobox"]');
    this.filterAssigneeSelect = page.locator('.filter-input-assignee_id [role="combobox"], [data-testid="filter-assignee"]');
  }

  async navigateToTasks() {
    await this.tasksMenuButton.waitFor({ state: 'visible' });
    await this.tasksMenuButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async openCreateForm() {
    await this.createButton.waitFor({ state: 'visible' });
    await this.createButton.click();
    await this.titleInput.waitFor({ state: 'visible' });
  }

  async createTask(title, content, assigneeName = null, statusName = null) {
    await this.titleInput.fill(title);
    await this.contentInput.fill(content);

    if (assigneeName) {
      await this.assigneeSelect.click();
      await this.page.locator(`li[role="option"]:has-text("${assigneeName}")`).click();
    }

    if (statusName) {
      await this.statusSelect.click();
      await this.page.locator(`li[role="option"]:has-text("${statusName}")`).click();
    }

    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async filterByStatus(statusName) {
    await this.filterStatusSelect.click();
    await this.page.locator(`li[role="option"]:has-text("${statusName}")`).click();
    await this.page.waitForLoadState('networkidle');
  }

   async moveTask(taskId, targetStatusId) {
    const sourceCard = this.taskCard(taskId);
    const targetColumn = this.kanbanColumn(targetStatusId);

    await sourceCard.waitFor({ state: 'visible' });
    await targetColumn.waitFor({ state: 'visible' });

    const cardBounds = await sourceCard.boundingBox();
    const columnBounds = await targetColumn.boundingBox();

    if (!cardBounds || !columnBounds) {
      throw new Error(`Не удалось рассчитать координаты для taskId: ${taskId}`);
    }

    const fromX = cardBounds.x + cardBounds.width / 2;
    const fromY = cardBounds.y + cardBounds.height / 2;
    const toX = columnBounds.x + columnBounds.width / 2;
    const toY = columnBounds.y + 100;

    await this.page.mouse.move(fromX, fromY);
    await this.page.mouse.down();
    
    await this.page.mouse.move(toX, toY, { steps: 20 }); 
    await this.page.mouse.up();

    await this.page.waitForLoadState('networkidle');
  }
}
