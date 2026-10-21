import { ListPage } from './ListPage.js';

export class LabelsPage extends ListPage {
  constructor(page) {
    super(page, 'Labels', 'Name');
    this.nameInput = this.formInput;
    this.nameColumnHeader = page.getByRole('columnheader').filter({ hasText: /^Name$/ });
  }

  getRowCells(id) {
    const row = this.getRow(id);
    return {
      name: row.getByRole('cell').nth(2),
    };
  }

  async createLabel(name) {
    await this.nameInput.fill(name);
    await this.save();
  }

  async editLabel(name) {
    await this.nameInput.fill(name);
    await this.save();
  }
}
