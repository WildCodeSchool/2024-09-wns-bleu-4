import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sign from '@/pages/Sign/sign';

const html = (
    <MemoryRouter>
        <Sign />
    </MemoryRouter>
);

describe('Sign', () => {
    it('should contain a form', () => {
        render(html);
        const form = screen.getByTestId('signup-form');

        expect(form).toBeInTheDocument();
    });

    it('should contain 2 labels', () => {
        render(html);
        const labels = document.querySelectorAll('label');
        expect(labels.length).toBe(2);
    });

    it('should contain 2 inputs', () => {
        render(html);
        const inputs = screen.getAllByRole('textbox');

        expect(inputs.length).toBe(2);
    });

    it('should contain 2 buttons', () => {
        render(html);
        const buttons = screen.getAllByRole('button');

        expect(buttons.length).toBe(2);
    });
});
