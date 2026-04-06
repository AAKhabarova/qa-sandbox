import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly logoutButton: Locator;
    readonly adminNavigationLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByTestId('auth-email-input');
        this.passwordInput = page.getByTestId('auth-password-input');
        this.signInButton = page.getByTestId('auth-login-btn');
        this.logoutButton = page.getByTestId('auth-logout-btn');
        this.adminNavigationLink = page.getByTestId('nav-admin');
    }

    async goto() {
        await this.page.goto('/login');
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }
}