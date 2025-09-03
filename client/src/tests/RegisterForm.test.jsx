import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { register } from '../services/auth.service';

// Mock the auth service
jest.mock('../../services/auth.service', () => ({
  register: jest.fn(),
}));

// Mock react-router-dom
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the register form correctly', () => {
    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );

    expect(screen.getByTestId('register-username-input')).toBeInTheDocument();
    expect(screen.getByTestId('register-email-input')).toBeInTheDocument();
    expect(screen.getByTestId('register-password-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('shows validation errors for invalid fields', async () => {
    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(register).not.toHaveBeenCalled();
  });

  test('calls register service and navigates on successful registration', async () => {
    register.mockResolvedValue({});

    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('register-username-input'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByTestId('register-email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('register-password-input'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith('testuser', 'test@example.com', 'password');
    });

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('shows an error message on failed registration', async () => {
    const errorMessage = 'Email is already in use';
    register.mockRejectedValue({ response: { data: { message: errorMessage } } });

    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('register-username-input'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByTestId('register-email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('register-password-input'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith('testuser', 'test@example.com', 'password');
    });

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});
