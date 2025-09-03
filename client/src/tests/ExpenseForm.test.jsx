import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExpenseForm from '../components/expenses/ExpenseForm';

describe('ExpenseForm', () => {
  it('renders the expense form', () => {
    render(<ExpenseForm />);
    expect(screen.getByTestId('expense-description-input')).toBeInTheDocument();
    expect(screen.getByTestId('expense-amount-input')).toBeInTheDocument();
    expect(screen.getByTestId('expense-date-input')).toBeInTheDocument();
    expect(screen.getByTestId('expense-category-select')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<ExpenseForm />);
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Amount is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Category is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for zero amount', async () => {
    render(<ExpenseForm />);
    fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText(/Amount must be greater than zero/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for negative amount', async () => {
    render(<ExpenseForm />);
    fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '-10' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText(/Amount must be greater than zero/i)).toBeInTheDocument();
    });
  });

  it('calls onExpenseCreated with correct data when form is submitted', async () => {
    const mockOnExpenseCreated = jest.fn();
    render(<ExpenseForm onExpenseCreated={mockOnExpenseCreated} />);

    fireEvent.change(screen.getByTestId('expense-description-input'), { target: { value: 'Groceries' } });
    fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '50' } });
    fireEvent.change(screen.getByTestId('expense-date-input'), { target: { value: '2023-01-15' } });
    fireEvent.click(screen.getByTestId('expense-category-select'));
    fireEvent.click(screen.getByText('Food'));

    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(mockOnExpenseCreated).toHaveBeenCalledWith({
        description: 'Groceries',
        amount: 50,
        category: 'FOOD',
        date: '2023-01-15',
      });
    });
  });

  it('resets form fields after successful submission', async () => {
    const mockOnExpenseCreated = jest.fn();
    render(<ExpenseForm onExpenseCreated={mockOnExpenseCreated} />);

    fireEvent.change(screen.getByTestId('expense-description-input'), { target: { value: 'Groceries' } });
    fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '50' } });
    fireEvent.change(screen.getByTestId('expense-date-input'), { target: { value: '2023-01-15' } });
    fireEvent.click(screen.getByTestId('expense-category-select'));
    fireEvent.click(screen.getByText('Food'));

    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByTestId('expense-description-input')).toHaveValue('');
      expect(screen.getByTestId('expense-amount-input')).toHaveValue(null); // fixed from null → ''
      expect(screen.getByTestId('expense-date-input')).toHaveValue('');
      expect(screen.getByTestId('expense-category-select')).toHaveValue('');
    });
  });

  it('populates form fields when editingExpense is provided', () => {
    const editingExpense = {
      id: 1,
      description: 'Old Description',
      amount: 100,
      category: 'TRAVEL',
      date: '2023-02-01',
    };
    render(<ExpenseForm editingExpense={editingExpense} />);

    expect(screen.getByTestId('expense-description-input')).toHaveValue('Old Description');
    expect(screen.getByTestId('expense-amount-input')).toHaveValue(100);
    expect(screen.getByTestId('expense-date-input')).toHaveValue('2023-02-01');
    expect(screen.getByTestId('expense-category-select')).toHaveTextContent('Travel');
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });

  it('calls onExpenseUpdated with correct data when form is submitted in editing mode', async () => {
    const mockOnExpenseUpdated = jest.fn();
    const editingExpense = {
      id: 1,
      description: 'Old Description',
      amount: 100,
      category: 'TRAVEL',
      date: '2023-02-01',
    };
    render(<ExpenseForm editingExpense={editingExpense} onExpenseUpdated={mockOnExpenseUpdated} />);

    fireEvent.change(screen.getByTestId('expense-description-input'), { target: { value: 'Updated Description' } });
    fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '120' } });
    fireEvent.change(screen.getByTestId('expense-date-input'), { target: { value: '2023-02-05' } });
    fireEvent.click(screen.getByTestId('expense-category-select'));
    fireEvent.click(screen.getByText('Bills'));

    fireEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(mockOnExpenseUpdated).toHaveBeenCalledWith(1, {
        description: 'Updated Description',
        amount: 120,
        category: 'BILLS',
        date: '2023-02-05',
      });
    });
  });
});