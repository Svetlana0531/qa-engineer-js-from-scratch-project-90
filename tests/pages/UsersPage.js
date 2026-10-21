import { ListPage } from './ListPage.js';

export class UsersPage extends ListPage {
  constructor(page) {
    super(page, 'Users', 'First name');
    this.firstNameInput = this.formInput;
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name', exact: true });
    this.emailInput = page.getByRole('textbox', { name: 'Email', exact: true });
    this.undoButton = page.getByRole('button', { name: 'Undo', exact: true });
    this.firstNameColumnHeader = page.getByRole('columnheader').filter({ hasText: /^First name$/ });
    this.lastNameColumnHeader = page.getByRole('columnheader').filter({ hasText: /^Last name$/ });
    this.emailColumnHeader = page.getByRole('columnheader').filter({ hasText: /^Email$/ });
  }

  getRowCells(id) {
    const row = this.getRow(id);
    return {
      email: row.getByRole('cell').nth(2),
      firstName: row.getByRole('cell').nth(3),
      lastName: row.getByRole('cell').nth(4),
    };
  }

  async createUser(firstName, lastName, email) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.save();
  }

  async editUser(updatedData) {
    if (updatedData.firstName) await this.firstNameInput.fill(updatedData.firstName);
    if (updatedData.lastName) await this.lastNameInput.fill(updatedData.lastName);
    if (updatedData.email) await this.emailInput.fill(updatedData.email);
    await this.save();
  }
}
