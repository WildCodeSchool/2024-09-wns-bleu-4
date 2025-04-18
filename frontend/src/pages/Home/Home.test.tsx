import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '@/pages/Home/Home';
import '@testing-library/jest-dom';

export const html = (
    <MemoryRouter>
        <Home />
    </MemoryRouter>
);

describe('Home', () => {
    it('Should contain 1 link', async () => {
        render(html);
        const homeWrapper = await screen.findByTestId('home-wrapper');
        const links = homeWrapper.querySelectorAll('a');

        expect(links.length).toBe(1);

        links.forEach((link) => {
            expect(link).toHaveAttribute('href');
        });
    });
});
