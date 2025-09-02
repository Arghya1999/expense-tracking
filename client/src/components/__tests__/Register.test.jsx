import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from '../auth/RegisterForm';
import * as authService from '../../services/auth.service';

// Mock the auth service and react-router-dom
jest.mock('../../services/auth.service');
jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
}));

describe('Register', () => {
    it('renders the registration form', () => {
        render(<RegisterForm />);
        expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /password/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('shows password length error for short password', async () => {
        render(<RegisterForm />);
        const passwordInput = screen.getByRole('textbox', { name: /password/i });
        fireEvent.change(passwordInput, { target: { value: 'short' } });
        fireEvent.blur(passwordInput); // Trigger validation on blur
        await waitFor(() => {
            expect(screen.getByText(/the password must be between 6 and 40 characters./i)).toBeInTheDocument();
        });
    });

    it('shows password length error for long password', async () => {
        render(<RegisterForm />);
        const passwordInput = screen.getByRole('textbox', { name: /password/i });
        fireEvent.change(passwordInput, { target: { value: 'a'.repeat(41) } });
        fireEvent.blur(passwordInput); // Trigger validation on blur
        await waitFor(() => {
            expect(screen.getByText(/the password must be between 6 and 40 characters./i)).toBeInTheDocument();
        });
    });

    it('does not show password error for valid password', async () => {
        render(<RegisterForm />);
        const passwordInput = screen.getByRole('textbox', { name: /password/i });
        fireEvent.change(passwordInput, { target: { value: 'validpassword' } });
        fireEvent.blur(passwordInput); // Trigger validation on blur
        await waitFor(() => {
            expect(screen.queryByText(/the password must be between 6 and 40 characters./i)).not.toBeInTheDocument();
        });
    });

    it('calls register service and navigates on successful registration', async () => {
        authService.register.mockResolvedValueOnce({});
        const navigateMock = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);

        render(<RegisterForm />);

        fireEvent.change(screen.getByRole('textbox', { name: /username/i }), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByRole('textbox', { name: /password/i }), { target: { value: 'testpassword' } });

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(authService.register).toHaveBeenCalledWith('testuser', 'test@example.com', 'testpassword');
            expect(screen.getByText(/registration successful!/i)).toBeInTheDocument();
            expect(navigateMock).toHaveBeenCalledWith('/login');
        });
    });

    it('displays error message on failed registration', async () => {
        const errorMessage = 'Registration failed';
        authService.register.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

        render(<RegisterForm />);

        fireEvent.change(screen.getByRole('textbox', { name: /username/i }), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByRole('textbox', { name: /password/i }), { target: { value: 'testpassword' } });

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });
});
