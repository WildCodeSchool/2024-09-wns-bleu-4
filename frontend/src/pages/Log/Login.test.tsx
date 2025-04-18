import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '@/pages/Log/Login';

export const html = (
    <MemoryRouter>
        <Login />
    </MemoryRouter>
);

describe('Login', () => {
    it('should contain 2 inputs', () => {
        render(html);
        const inputs = screen.getAllByRole('textbox');

        expect(inputs.length).toBe(2);
    });

    it('Should contain 2 links', async () => {
        render(html);
        const linksContainer = screen.getByTestId('links-supp');
        const links = linksContainer.querySelectorAll('a');

        expect(links.length).toBe(2);

        links.forEach((link) => {
            expect(link).toHaveAttribute('href');
        });
    });
});
