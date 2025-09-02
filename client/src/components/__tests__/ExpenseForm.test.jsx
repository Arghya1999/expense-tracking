
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExpenseForm from '../expenses/ExpenseForm';

describe('ExpenseForm', () => {
    it('renders the expense form', () => {
        render(<ExpenseForm />);
        expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
        expect(screen.getByRole('spinbutton', { name: /amount/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /date/i })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty fields', async () => {
        render(<ExpenseForm />);
        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText(/Amount is required/i)).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText(/Date is required/i)).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText(/Category is required/i)).toBeInTheDocument();
        });
    });

    it('shows validation error for zero amount', async () => {
        render(<ExpenseForm />);
        fireEvent.change(screen.getByRole('spinbutton', { name: /amount/i }), { target: { value: '0' } });
        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(screen.getByText(/Amount must be greater than zero/i)).toBeInTheDocument();
        });
    });

    it('shows validation error for negative amount', async () => {
        render(<ExpenseForm />);
        fireEvent.change(screen.getByRole('spinbutton', { name: /amount/i }), { target: { value: '-10' } });
        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(screen.getByText(/Amount must be greater than zero/i)).toBeInTheDocument();
        });
    });

    it('calls onExpenseCreated with correct data when form is submitted', async () => {
        const mockOnExpenseCreated = jest.fn();
        render(<ExpenseForm onExpenseCreated={mockOnExpenseCreated} />);

        fireEvent.change(screen.getByRole('textbox', { name: /description/i }), { target: { value: 'Groceries' } });
        fireEvent.change(screen.getByRole('spinbutton', { name: /amount/i }), { target: { value: '50' } });
        fireEvent.change(screen.getByRole('textbox', { name: /date/i }), { target: { value: '2023-01-15' } });
        fireEvent.change(screen.getByRole('combobox', { name: /category/i }), { target: { value: 'FOOD' } });

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

        fireEvent.change(screen.getByRole('textbox', { name: /description/i }), { target: { value: 'Groceries' } });
        fireEvent.change(screen.getByRole('spinbutton', { name: /amount/i }), { target: { value: '50' } });
        fireEvent.change(screen.getByRole('textbox', { name: /date/i }), { target: { value: '2023-01-15' } });
        fireEvent.change(screen.getByRole('combobox', { name: /category/i }), { target: { value: 'FOOD' } });

        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: /description/i })).toHaveValue('');
        });
        await waitFor(() => {
            expect(screen.getByRole('spinbutton', { name: /amount/i })).toHaveValue(null); // Amount input type="number" returns null for empty
        });
        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: /date/i })).toHaveValue('');
        });
        await waitFor(() => {
            expect(screen.getByRole('combobox', { name: /category/i })).toHaveValue('');
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

        expect(screen.getByRole('textbox', { name: /description/i })).toHaveValue('Old Description');
        expect(screen.getByRole('spinbutton', { name: /amount/i })).toHaveValue(100);
        expect(screen.getByRole('textbox', { name: /date/i })).toHaveValue('2023-02-01');
        expect(screen.getByRole('combobox', { name: /category/i })).toHaveValue('TRAVEL');
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

        fireEvent.change(screen.getByRole('textbox', { name: /description/i }), { target: { value: 'Updated Description' } });
        fireEvent.change(screen.getByRole('spinbutton', { name: /amount/i }), { target: { value: '120' } });
        fireEvent.change(screen.getByRole('textbox', { name: /date/i }), { target: { value: '2023-02-05' } });
        fireEvent.change(screen.getByRole('combobox', { name: /category/i }), { target: { value: 'BILLS' } });

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
