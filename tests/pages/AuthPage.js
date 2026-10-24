export class AuthPage {
  constructor(page) {
    this.page = page

    this.usernameInput = page.getByRole('textbox', { name: 'Username', exact: true })
    this.passwordInput = page.getByLabel('Password')

    this.submitButton = page.getByRole('button', { name: 'Sign in', exact: true })

    this.profileButton = page.getByRole('button', { name: 'Profile', exact: true })

    this.logoutButton = page.getByRole('menuitem', { name: 'Logout', exact: true })
  }

  async navigate() {
    await this.page.goto('/#/login')
  }

  async login(username, password) {
    await this.usernameInput.waitFor({ state: 'visible' })
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async logout() {
    await this.profileButton.waitFor({ state: 'visible' })
    await this.profileButton.click()

    await this.logoutButton.waitFor({ state: 'visible' })
    await this.logoutButton.click()
  }
}
