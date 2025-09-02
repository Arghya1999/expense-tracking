
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../auth/LoginForm';

// Mock the auth service and react-router-dom
jest.mock('../../services/auth.service', () => ({
    login: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
    Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

describe('LoginForm', () => {
    it('renders the login form', () => {
        render(<LoginForm />);
        expect(screen.getByRole('textbox', { name: /username or email/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /password/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty fields', async () => {
        render(<LoginForm />);
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/Username or Email is required/i)).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
        });
    });
});
