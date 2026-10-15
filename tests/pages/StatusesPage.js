export class StatusesPage {
  constructor(page) {
    this.page = page;

    this.statusesMenuButton = page.locator('a[role="menuitem"][href="#/task_statuses"]')
      .or(page.locator('a[role="menuitem"][href="#/statuses"]'));

    this.createButton = page.locator('a[href="#/task_statuses/create"], a[href="#/statuses/create"]');
    this.saveButton = page.locator('button[type="submit"]', { hasText: 'Save' });
    this.deleteButton = page.locator('[data-test="bulk-actions-toolbar"] button[aria-label="Delete"]');

    this.nameInput = page.locator('input[name="name"]');
    this.slugInput = page.locator('input[name="slug"]');

    this.tableRow = page.locator('tbody tr.RaDatagrid-row');
    this.selectAllCheckbox = page.locator('thead input[type="checkbox"][aria-label="Select all"]');
    this.rowCheckbox = page.locator('tbody input[type="checkbox"]');
  }

  async navigateToStatuses() {
    await this.statusesMenuButton.waitFor({ state: 'visible' });
    await this.statusesMenuButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async openCreateForm() {
    await this.createButton.waitFor({ state: 'visible' });
    await this.createButton.click();
    await this.nameInput.waitFor({ state: 'visible' });
  }

  async createStatus(name, slug) {
    await this.nameInput.fill(name);
    await this.slugInput.fill(slug);
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async openEditFormOfFirstStatus() {
    const firstRowCell = this.tableRow.first().locator('td').nth(1);
    await firstRowCell.waitFor({ state: 'visible' });
    await firstRowCell.click();
    await this.nameInput.waitFor({ state: 'visible' });
  }

  async editStatus(updatedData) {
    if (updatedData.name) await this.nameInput.fill(updatedData.name);
    if (updatedData.slug) await this.slugInput.fill(updatedData.slug);
    await this.saveButton.click();
  }
}
