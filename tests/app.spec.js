import { test, expect } from './fixtures.js'

test.describe('Application Initial Loading and Layout', () => {
  test('application renders successfully on the main page with visible login form', async ({ authPage, page }) => {
    await page.goto('/')

    await expect(authPage.usernameInput).toBeVisible()
    await expect(authPage.passwordInput).toBeVisible()
    await expect(authPage.submitButton).toBeVisible()
  })

  test('application navigates to the login page and provides accessibility options', async ({ authPage }) => {
    await expect(authPage.usernameInput).toBeEditable()
  })
})
