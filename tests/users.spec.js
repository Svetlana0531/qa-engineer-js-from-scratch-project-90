import { test, expect } from './fixtures.js'
import { invalidData, seedData, validationMessages } from './data.js'

test.describe('Login Negative Scenarios', () => {
  test('should show validation error when trying to login with an empty form', async ({ authPage }) => {
    await authPage.submitButton.click()

    await expect(authPage.usernameInput).toHaveAccessibleDescription(validationMessages.required)
  })

  test('should show validation error when username is missing', async ({ authPage }) => {
    await authPage.passwordInput.fill(invalidData.password)
    await authPage.submitButton.click()

    await expect(authPage.usernameInput).toHaveAccessibleDescription(validationMessages.required)
  })
})

test.describe('Users Management CRUD Flow', () => {
  test('should successfully display users list with required columns', async ({ usersPage }) => {
    await expect(usersPage.firstNameColumnHeader).toBeVisible()
    await expect(usersPage.lastNameColumnHeader).toBeVisible()
    await expect(usersPage.emailColumnHeader).toBeVisible()

    const user = usersPage.getRowCells(seedData.user.id)
    await expect(user.firstName).toHaveText(seedData.user.firstName)
    await expect(user.lastName).toHaveText(seedData.user.lastName)
    await expect(user.email).toHaveText(seedData.user.email)
  })

  test('should successfully create a new user', async ({ usersPage, testData }) => {
    await usersPage.openCreateForm()

    await expect(usersPage.firstNameInput).toBeVisible()
    await expect(usersPage.emailInput).toBeVisible()

    const { firstName, lastName, email } = testData.user
    await usersPage.createUser(firstName, lastName, email)

    await usersPage.navigate()
    await expect(usersPage.getCell(email)).toBeVisible()
  })

  test('should not create a user with an empty form because save button is disabled', async ({ usersPage, page }) => {
    await usersPage.openCreateForm()

    await expect(usersPage.saveButton).toBeDisabled()
    await expect(page).toHaveURL(/#\/users\/create/)
  })

  test('should edit user data and validate email field', async ({ usersPage, testData }) => {
    await usersPage.openEditFormOfFirstRow()

    await usersPage.emailInput.fill(invalidData.email)
    await usersPage.saveButton.click()

    await expect(usersPage.emailInput).toHaveAccessibleDescription(validationMessages.invalidEmail)

    await usersPage.editUser(testData.user.updated)

    await expect(usersPage.getCell(testData.user.updated.email)).toBeVisible()
  })

  test('should cancel single user deletion via undo notification', async ({ usersPage }) => {
    await expect(usersPage.firstRow).toBeVisible()
    await expect(usersPage.firstRowValueCell).toHaveText(seedData.user.email)

    await usersPage.selectFirstRow()
    await usersPage.deleteSelectedRows()
    await usersPage.undoButton.click()

    await expect(usersPage.getCell(seedData.user.email)).toBeVisible()
  })

  test('should delete a single user via row checkbox', async ({ usersPage }) => {
    await expect(usersPage.firstRow).toBeVisible()
    await expect(usersPage.firstRowValueCell).toHaveText(seedData.user.email)

    await usersPage.selectFirstRow()
    await usersPage.deleteSelectedRows()

    await expect(usersPage.getCell(seedData.user.email)).not.toBeVisible()
  })

  test('should perform mass deletion of all users', async ({ usersPage }) => {
    await expect(usersPage.firstRowCheckbox).toBeVisible()

    await usersPage.selectAllRows()
    await expect(usersPage.firstRowCheckbox).toBeChecked()

    await usersPage.deleteSelectedRows()

    await expect(usersPage.rowCheckbox).toHaveCount(0)
  })
})
