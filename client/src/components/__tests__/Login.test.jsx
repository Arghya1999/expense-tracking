import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../auth/LoginForm';
import * as authService from '../../services/auth.service';

// Mock the auth service and react-router-dom
jest.mock('../../services/auth.service');
jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
    Link: ({ to, children }) => <a href={to}>{children}</a>, // Mock Link component
}));

describe('Login', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    
    
    
    it('renders the login form', () => {
        const mockReload = jest.fn();
        render(<Login reload={mockReload} />);
        expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByText(/Not registered\?/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Create an account/i })).toBeInTheDocument();
    });

    it('calls login service and navigates on successful login', async () => {
        authService.login.mockResolvedValueOnce({});
        const navigateMock = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);
        const mockReload = jest.fn();

        render(<Login reload={mockReload} />);

        fireEvent.change(screen.getByLabelText(/username or email/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith('testuser', 'testpassword');
            expect(navigateMock).toHaveBeenCalledWith('/expenses');
            
            
        });
    });

    it('displays error message on failed login', async () => {
        const errorMessage = 'Login failed';
        authService.login.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });
        const mockReload = jest.fn();

        render(<Login reload={mockReload} />);

        fireEvent.change(screen.getByLabelText(/username or email/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });
});
