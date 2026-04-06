import { test, expect } from '@playwright/test';
import { LoginPage } from './Pages/login.page';

test.describe('Login', () => {
  test('should sign in with valid admin credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('admin@buzzhive.com', 'admin123');

    await expect(page).toHaveURL('/');
    await expect(loginPage.logoutButton).toBeVisible();
    await expect(loginPage.adminNavigationLink).toBeVisible();
  });
});
