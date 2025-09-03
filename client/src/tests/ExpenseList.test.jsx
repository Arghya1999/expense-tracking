import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExpenseList from '../components/expenses/ExpenseList';
import * as api from '../services/api';

jest.mock('../../services/api', () => ({
  deleteExpense: jest.fn(() => Promise.resolve()),
}));

describe('ExpenseList', () => {
  const mockFetchExpenses = jest.fn();
  const mockOnEdit = jest.fn();
  const expenses = [
    { id: 1, description: 'Expense 1', amount: 100, category: 'FOOD', date: '2025-01-01' },
    { id: 2, description: 'Expense 2', amount: 200, category: 'HEALTH', date: '2025-01-02' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a message when there are no expenses', () => {
    render(<ExpenseList expenses={[]} fetchExpenses={mockFetchExpenses} onEdit={mockOnEdit} />);
    expect(screen.getByText('No expenses to display.')).toBeInTheDocument();
  });

  it('should render a list of expenses', () => {
    render(<ExpenseList expenses={expenses} fetchExpenses={mockFetchExpenses} onEdit={mockOnEdit} />);
    expect(screen.getByText('Expense 1')).toBeInTheDocument();
    expect(screen.getByText('Expense 2')).toBeInTheDocument();
  });

  it('should call onEdit when the edit button is clicked', () => {
    render(<ExpenseList expenses={expenses} fetchExpenses={mockFetchExpenses} onEdit={mockOnEdit} />);
    fireEvent.click(screen.getByTestId(`edit-button-${expenses[0].id}`));
    expect(mockOnEdit).toHaveBeenCalledWith(expenses[0]);
  });

  it('should call deleteExpense and fetchExpenses when the delete button is clicked', async () => {
    render(<ExpenseList expenses={expenses} fetchExpenses={mockFetchExpenses} onEdit={mockOnEdit} />);
    fireEvent.click(screen.getByTestId(`delete-button-${expenses[0].id}`));
    expect(api.deleteExpense).toHaveBeenCalledWith(1);
    await screen.findByText('Expense 1'); // Wait for the promise to resolve
    expect(mockFetchExpenses).toHaveBeenCalled();
  });
});
