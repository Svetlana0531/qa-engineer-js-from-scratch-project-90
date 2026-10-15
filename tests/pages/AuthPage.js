export class AuthPage {
  constructor(page) {
    this.page = page;
    
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    
    this.submitButton = page.locator('button[type="submit"]', { hasText: 'Sign in' });
    
    this.profileButton = page.locator('button[aria-label="Profile"]');
    
    this.logoutButton = page.locator('li.logout, li[role="menuitem"]:has-text("Logout")');
  }

  async navigate() {
    await this.page.goto('/#/login');
  }

  async login(username, password) {
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async logout() {
    await this.profileButton.waitFor({ state: 'visible' });
    await this.profileButton.click();
    
    await this.logoutButton.waitFor({ state: 'visible' });
    await this.logoutButton.click();
  }
}
