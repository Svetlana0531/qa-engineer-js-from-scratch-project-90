export class UsersPage {
  constructor(page) {
    this.page = page;

    this.usersMenuButton = page.locator('a[href="#/users"]');

    this.createButton = page.locator('a[href="#/users/create"]');
    this.saveButton = page.locator('button[type="submit"]', { hasText: 'Save' });
    this.deleteButton = page.locator('[data-test="bulk-actions-toolbar"] button[aria-label="Delete"]');

    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.emailInput = page.locator('input[name="email"]');

    this.tableRow = page.locator('tbody tr.RaDatagrid-row');
    this.selectAllCheckbox = page.locator('thead input[type="checkbox"][aria-label="Select all"]');
    this.rowCheckbox = page.locator('tbody input[type="checkbox"]');

    this.emailError = page.locator('.MuiFormHelperText-root.Mui-error, .Mui-error');
  }

  async navigateToUsers() {
    await this.usersMenuButton.waitFor({ state: 'visible' });
    await this.usersMenuButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async openCreateForm() {
    await this.createButton.waitFor({ state: 'visible' });
    await this.createButton.click();
    await this.firstNameInput.waitFor({ state: 'visible' });
  }

  async createUser(firstName, lastName, email) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async openEditFormOfFirstUser() {
    const firstRowClickableCell = this.tableRow.first().locator('td.column-email');
    await firstRowClickableCell.waitFor({ state: 'visible' });
    await firstRowClickableCell.click();
    await this.firstNameInput.waitFor({ state: 'visible' });
  }

  async editUser(updatedData) {
    if (updatedData.firstName) await this.firstNameInput.fill(updatedData.firstName);
    if (updatedData.lastName) await this.lastNameInput.fill(updatedData.lastName);
    if (updatedData.email) await this.emailInput.fill(updatedData.email);
    await this.saveButton.click();
  }
}
