export class LabelsPage {
  constructor(page) {
    this.page = page;

    this.labelsMenuButton = page.locator('nav a[href*="label"]')
      .or(page.locator('a[href="#/labels"]'))
      .or(page.locator('[role="menuitem"]:has-text("Label")'))
      .or(page.locator('.ra-menu a[href*="label"]'))
      .first();

    this.createButton = page.locator('.RaList-actions a[href="#/labels/create"]')
      .or(page.locator('a[href="#/labels/create"]')).first();
      
    this.saveButton = page.locator('button[type="submit"]', { hasText: 'Save' });
    this.deleteButton = page.locator('[data-test="bulk-actions-toolbar"] button[aria-label="Delete"]');

    this.nameInput = page.locator('input[name="name"]');

    this.tableRow = page.locator('tbody tr.RaDatagrid-row');
    this.selectAllCheckbox = page.locator('thead input[type="checkbox"][aria-label="Select all"]');
    this.rowCheckbox = page.locator('tbody input[type="checkbox"]');
  }

  async navigateToLabels() {
    await this.labelsMenuButton.waitFor({ state: 'visible' });
    await this.labelsMenuButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async openCreateForm() {
    await this.createButton.waitFor({ state: 'visible' });
    await this.createButton.click();
    await this.nameInput.waitFor({ state: 'visible' });
  }

  async createLabel(name) {
    await this.nameInput.fill(name);
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async openEditFormOfFirstLabel() {
    const firstRowCell = this.tableRow.first().locator('td.column-name');
    await firstRowCell.waitFor({ state: 'visible' });
    await firstRowCell.click();
    await this.nameInput.waitFor({ state: 'visible' });
  }

  async editLabel(name) {
    await this.nameInput.fill(name);
    await this.saveButton.click();
  }
}
