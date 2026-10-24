export class ListPage {
  constructor(page, menuName, formFieldName) {
    this.page = page
    this.menuButton = page.getByRole('menuitem', { name: menuName, exact: true })
    this.formInput = page.getByRole('textbox', { name: formFieldName, exact: true })
    this.createButton = page.getByRole('link', { name: 'Create', exact: true })
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true })
    this.deleteButton = page.getByRole('button', { name: 'Delete', exact: true })

    this.table = page.getByRole('table')
    this.tableRow = this.table.getByRole('row').filter({ has: page.getByRole('cell') })
    this.firstRow = this.tableRow.first()
    this.firstRowValueCell = this.firstRow.getByRole('cell').nth(2)
    this.selectAllCheckbox = this.table.getByRole('checkbox', { name: 'Select all', exact: true })
    this.rowCheckbox = this.tableRow.getByRole('checkbox')
    this.firstRowCheckbox = this.firstRow.getByRole('checkbox')
  }

  async navigate() {
    await this.menuButton.waitFor({ state: 'visible' })
    await this.menuButton.click()
    await this.createButton.waitFor({ state: 'visible' })
  }

  async openCreateForm() {
    await this.createButton.waitFor({ state: 'visible' })
    await this.createButton.click()
    await this.formInput.waitFor({ state: 'visible' })
  }

  async openEditFormOfFirstRow() {
    await this.firstRowValueCell.click()
    await this.formInput.waitFor({ state: 'visible' })
  }

  async save() {
    const formUrl = this.page.url()
    await this.saveButton.click()
    await this.page.waitForURL(url => url.href !== formUrl)
  }

  getCell(value) {
    return this.table.getByRole('cell', { name: value, exact: true })
  }

  getRow(id) {
    return this.tableRow.filter({
      has: this.page.getByRole('cell', { name: String(id), exact: true }),
    })
  }

  async selectFirstRow() {
    await this.firstRowCheckbox.check()
  }

  async selectAllRows() {
    await this.selectAllCheckbox.check()
  }

  async deleteSelectedRows() {
    await this.deleteButton.click()
  }
}
