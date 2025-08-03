
import React from 'react';
import { deleteExpense } from '../services/api';

const ExpenseList = ({ expenses, fetchExpenses, onEdit }) => {

    const handleDelete = (id) => {
        deleteExpense(id).then(() => {
            fetchExpenses();
        });
    };

    return (
        <div className="card p-4 shadow-sm rounded-3">
            <h2 className="card-title text-center mb-4 text-primary">Expenses</h2>
            <ul className="list-group list-group-flush">
                {expenses.length === 0 ? (
                    <li className="list-group-item text-center text-muted py-3">No expenses to display.</li>
                ) : (
                    expenses.map(expense => (
                        <li key={expense.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                            <div>
                                <h5 className="mb-1">{expense.description}</h5>
                                <small className="text-muted">{expense.category} - {expense.date}</small>
                            </div>
                            <div className="text-end">
                                <h5 className="mb-1 text-success">₹{expense.amount.toFixed(2)}</h5>
                                <div className="btn-group" role="group" aria-label="Expense actions">
                                    <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => onEdit(expense)}>Edit</button>
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(expense.id)}>Delete</button>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default ExpenseList;
