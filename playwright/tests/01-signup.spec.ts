import { test, expect } from '@playwright/test';
import credentials from '../mocks';

test.describe('User Registration', () => {

    test('should display signup form', async ({ page }) => {
        await page.goto('/sign');
        
        // Check if the signup form is displayed
        await expect(page.getByTestId('form')).toBeVisible();
        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(page.getByLabel('Mot de passe')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Valider' })).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
        await page.goto('/sign');
        
        // Try to submit with invalid email
        await page.getByLabel('Email').fill('invalid');
        await page.getByLabel('Mot de passe').fill(credentials.password);
        
        // Button should be disabled with invalid email
        await expect(page.getByRole('button', { name: 'Valider' })).toBeDisabled();
    });

    test('should validate password requirements', async ({ page }) => {
        await page.goto('/sign');
        
        // Try to submit with weak password
        await page.getByLabel('Email').fill(credentials.email);
        await page.getByLabel('Mot de passe').fill('weak');
        
        // Button should be disabled with weak password
        await expect(page.getByRole('button', { name: 'Valider' })).toBeDisabled();
    });

    test('should show password requirements', async ({ page }) => {

        const passwordErrorLocator = page.getByTestId('password-error');
        const passwordErrorMessages = {
            tooShort: 'Le mot de passe doit contenir au moins 12 caractères',
            noUppercase: 'Doit contenir au moins une majuscule',
            noDigit: 'Doit contenir au moins un chiffre',
            noSpecialChar: 'Doit contenir au moins un caractère spécial',
        }

        await page.goto('/sign');
        
        // Fill email and start typing password
        await page.getByLabel('Email').fill(credentials.email);
        await page.getByLabel('Mot de passe').fill('weak');
        
        // Should show password validation errors
        await expect(passwordErrorLocator).toHaveText(passwordErrorMessages.tooShort);
        
        await page.getByLabel('Mot de passe').fill('weakpassword');
        await expect(passwordErrorLocator).toHaveText(passwordErrorMessages.noUppercase);
        
        await page.getByLabel('Mot de passe').fill('WeakPassword');
        await expect(passwordErrorLocator).toHaveText(passwordErrorMessages.noDigit);
        
        await page.getByLabel('Mot de passe').fill('WeakPassword123');
        await expect(passwordErrorLocator).toHaveText(passwordErrorMessages.noSpecialChar);
    });

    test('should allow password visibility toggle', async ({ page }) => {
        await page.goto('/sign');
        
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

    test('should submit registration and display confirm form', async ({ page }) => {
        await page.goto('/sign');
        
        // Fill form with valid data
        await page.getByLabel('Email').fill(credentials.email);
        await page.getByLabel('Mot de passe').fill(credentials.password);
        
        // Submit form
        await page.getByRole('button', { name: 'Valider' }).click();
        
        // Should show confirmation message
        await expect(page.getByText('Veuillez vérifier votre email pour confirmer votre compte.')).toBeVisible();
        
        // Should display confirmation form
        await expect(page.getByText('Vérification inscription')).toBeVisible();
    });
}); 