import { ListPage } from './ListPage.js';

export class StatusesPage extends ListPage {
  constructor(page) {
    super(page, 'Task statuses', 'Name');
    this.nameInput = this.formInput;
    this.slugInput = page.getByRole('textbox', { name: 'Slug', exact: true });
    this.nameColumnHeader = page.getByRole('columnheader').filter({ hasText: /^Name$/ });
    this.slugColumnHeader = page.getByRole('columnheader').filter({ hasText: /^Slug$/ });
  }

  getRowCells(id) {
    const row = this.getRow(id);
    return {
      name: row.getByRole('cell').nth(2),
      slug: row.getByRole('cell').nth(3),
    };
  }

  async createStatus(name, slug) {
    await this.nameInput.fill(name);
    await this.slugInput.fill(slug);
    await this.save();
  }

  async editStatus(updatedData) {
    if (updatedData.name) await this.nameInput.fill(updatedData.name);
    if (updatedData.slug) await this.slugInput.fill(updatedData.slug);
    await this.save();
  }
}
