import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ExpensesPage from '../pages/ExpensesPage';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../services/api';
import { logout } from '../services/auth.service';

// Mock the API service
jest.mock('../services/api', () => ({
  getExpenses: jest.fn(),
  createExpense: jest.fn(),
  updateExpense: jest.fn(),
  deleteExpense: jest.fn(),
}));

// Mock the auth service
jest.mock('../services/auth.service', () => ({
  logout: jest.fn(),
}));

// Mock react-router-dom
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('ExpensesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockExpenses = [
    { id: 1, description: 'Groceries', amount: 150, date: '2025-09-01' },
    { id: 2, description: 'Utilities', amount: 100, date: '2025-09-02' },
  ];

  test('renders the expenses page and displays expenses', async () => {
    getExpenses.mockResolvedValue({ data: mockExpenses });

    render(
      <BrowserRouter>
        <ExpensesPage />
      </BrowserRouter>
    );

    // Check for loading state
    await waitFor(() => {
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    // Wait for expenses to be loaded and displayed
    await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
        expect(screen.getByText('Utilities')).toBeInTheDocument();
        expect(screen.getByText(/Total Expense: ₹250.00/i)).toBeInTheDocument();
    });
  });

  test('shows an error message if fetching expenses fails', async () => {
    getExpenses.mockRejectedValue(new Error('Failed to fetch'));

    render(
      <BrowserRouter>
        <ExpensesPage />
      </BrowserRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('Failed to fetch expenses. Please try again later.')).toBeInTheDocument();
    });
  });

  test('filters expenses by date', async () => {
    getExpenses.mockResolvedValue({ data: mockExpenses });

    render(
      <BrowserRouter>
        <ExpensesPage />
      </BrowserRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('start-date-input'), { target: { value: '2025-09-02' } });
    fireEvent.change(screen.getByTestId('end-date-input'), { target: { value: '2025-09-02' } });

    getExpenses.mockResolvedValue({ data: [mockExpenses[1]] });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(getExpenses).toHaveBeenCalledWith('2025-09-02', '2025-09-02');
    });

    await waitFor(() => {
        expect(screen.queryByText('Groceries')).not.toBeInTheDocument();
        expect(screen.getByText('Utilities')).toBeInTheDocument();
    });
  });
});
