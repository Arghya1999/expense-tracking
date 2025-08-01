
import React, { useState, useEffect } from 'react';

const ExpenseForm = ({ onExpenseCreated, editingExpense, onExpenseUpdated }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        if (editingExpense) {
            setDescription(editingExpense.description);
            setAmount(editingExpense.amount);
            setCategory(editingExpense.category);
            setDate(editingExpense.date);
        } else {
            setDescription('');
            setAmount('');
            setCategory('');
            setDate('');
        }
    }, [editingExpense]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const expense = { description, amount: parseFloat(amount), category, date };
        if (editingExpense) {
            onExpenseUpdated(editingExpense.id, expense);
        } else {
            onExpenseCreated(expense);
        }
        setDescription('');
        setAmount('');
        setCategory('');
        setDate('');
    };

    return (
        <div className="card p-4 shadow-sm">
            <h2 className="card-title text-center mb-4 text-primary">{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Groceries, Dinner" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., ₹50.00" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Select a category</option>
                        <option value="FOOD">Food</option>
                        <option value="HEALTH">Health</option>
                        <option value="CLOTHING">Clothing</option>
                        <option value="TRAVEL">Travel</option>
                        <option value="BILLS">Bills</option>
                        <option value="OTHERS">Others</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">{editingExpense ? 'Update' : 'Add'}</button>
            </form>
        </div>
    );
};

export default ExpenseForm;
