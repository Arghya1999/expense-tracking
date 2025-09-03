import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { login } from '../services/auth.service';

// Mock the auth service
jest.mock('../../services/auth.service', () => ({
  login: jest.fn(),
}));

// Mock react-router-dom
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe('LoginForm', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders the login form correctly', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    expect(screen.getByTestId('login-identifier-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-password-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Username or Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  test('calls login service and navigates on successful login', async () => {
    login.mockResolvedValue({});

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('login-identifier-input'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByTestId('login-password-input'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('testuser', 'password');
    });

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/expenses');
    });
  });

  test('shows an error message on failed login', async () => {
    const errorMessage = 'Invalid credentials';
    login.mockRejectedValue({ response: { data: { message: errorMessage } } });

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('login-identifier-input'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByTestId('login-password-input'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('wronguser', 'wrongpassword');
    });

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});
