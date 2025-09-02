import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../auth/LoginForm';
import * as authService from '../../services/auth.service';

// Mock the auth service and react-router-dom
jest.mock('../../services/auth.service');
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

    it('calls login service and navigates on successful login', async () => {
        authService.login.mockResolvedValueOnce({});
        const navigateMock = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);

        render(<LoginForm />);

        fireEvent.change(screen.getByRole('textbox', { name: /username or email/i }), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByRole('textbox', { name: /password/i }), { target: { value: 'testpassword' } });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith('testuser', 'testpassword');
            expect(navigateMock).toHaveBeenCalledWith('/expenses');
        });
    });

    it('displays error message on failed login', async () => {
        const errorMessage = 'Login failed';
        authService.login.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

        render(<LoginForm />);

        fireEvent.change(screen.getByRole('textbox', { name: /username or email/i }), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByRole('textbox', { name: /password/i }), { target: { value: 'wrongpassword' } });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });
});
