
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExpenseForm from '../expenses/ExpenseForm';


describe('ExpenseForm', () => {
    it('renders the expense form', () => {
        render(<ExpenseForm />);
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty fields', () => {
        render(<ExpenseForm />);
        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        expect(screen.getByText(/description is required/i)).toBeInTheDocument();
        expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
        expect(screen.getByText(/date is required/i)).toBeInTheDocument();
        expect(screen.getByText(/category is required/i)).toBeInTheDocument();
    });

    it('shows validation error for zero amount', () => {
        render(<ExpenseForm />);
        fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '0' } });
        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        expect(screen.getByText(/amount must be greater than zero/i)).toBeInTheDocument();
    });

    it('shows validation error for negative amount', () => {
        render(<ExpenseForm />);
        fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '-10' } });
        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        expect(screen.getByText(/amount must be greater than zero/i)).toBeInTheDocument();
    });
});
