import { test, expect } from '@playwright/test';
import credentials from '../mocks';

test.describe('User Login', () => {
    
    test('should display login form', async ({ page }) => {
        await page.goto('/login');
        
        // Check if the login form is displayed
        await expect(page.getByText('Connexion')).toBeVisible();
        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(page.getByLabel('Mot de passe')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Valider' })).toBeVisible();
    });

    test('should validate email format on login', async ({ page }) => {
        await page.goto('/login');
        
        // Try to submit with invalid email
        await page.getByLabel('Email').fill('invalid-email');
        await page.getByLabel('Mot de passe').fill(credentials.password);
        
        // Button should be disabled with invalid email
        await expect(page.getByRole('button', { name: 'Valider' })).toBeDisabled();
    });

    test('should validate password requirements on login', async ({ page }) => {
        await page.goto('/login');
        
        // Try to submit with weak password
        await page.getByLabel('Email').fill(credentials.email);
        await page.getByLabel('Mot de passe').fill('weak');
        
        // Button should be disabled with weak password
        await expect(page.getByRole('button', { name: 'Valider' })).toBeDisabled();
    });

    test('should allow password visibility toggle', async ({ page }) => {
        await page.goto('/login');
        
        const passwordInput = page.getByLabel('Mot de passe');
        const toggleButton = page.getByTestId('password-toggle');
        
        // Initially password should be hidden
        await expect(passwordInput).toHaveAttribute('type', 'password');
        
        // Click toggle to show password
        await toggleButton.click();
        await expect(passwordInput).toHaveAttribute('type', 'text');
        
        // Click toggle to hide password again
        await toggleButton.click();
        await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await page.goto('/login');
        
        // Fill form with invalid credentials
        await page.getByLabel('Email').fill('invalid@example.com');
        await page.getByLabel('Mot de passe').fill('InvalidPassword123!');
        
        // Submit form
        await page.getByRole('button', { name: 'Valider' }).click();
        
        // Should show error message
        await expect(page.getByText('Erreur de connexion')).toBeVisible();
    });

    test('should have forgot password link', async ({ page }) => {
        await page.goto('/login');
        
        // Check for forgot password link
        await expect(page.getByRole('link', { name: 'Mot de passe oublié ?' })).toBeVisible();
    });

    test('should have signup link', async ({ page }) => {
        await page.goto('/login');
        
        // Check for signup link
        await expect(page.getByRole('link', { name: 'Créer un compte' })).toBeVisible();
    });

    test('should navigate to signup page', async ({ page }) => {
        await page.goto('/login');
        
        // Click on signup link
        await page.getByRole('link', { name: 'Créer un compte' }).click();
        
        // Should navigate to signup page
        await expect(page).toHaveURL('/sign');
        await expect(page.getByText('Inscription')).toBeVisible();
    });

    test('should navigate to forgot password page', async ({ page }) => {
        await page.goto('/login');
        
        // Click on forgot password link
        await page.getByRole('link', { name: 'Mot de passe oublié ?' }).click();
        
        // Should navigate to forgot password page
        await expect(page).toHaveURL('/forgot-password');
    });

    test('should redirect to home page after successful login', async ({ page }) => {
        await page.goto('/login');
        
        // Fill form with valid credentials (this would need a test user)
        await page.getByLabel('Email').fill('admin@example.com');
        await page.getByLabel('Mot de passe').fill('Admin@123456');
        
        // Submit form
        await page.getByRole('button', { name: 'Valider' }).click();
        
        // Should redirect to home page and show success message
        await expect(page).toHaveURL('/');
        await expect(page.getByText('Connexion réussie')).toBeVisible();
    });
}); 