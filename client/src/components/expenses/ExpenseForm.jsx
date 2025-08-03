
import React, { useState, useEffect } from 'react';


const ExpenseForm = ({ onExpenseCreated, editingExpense, onExpenseUpdated }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [errors, setErrors] = useState({});

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

    const validate = () => {
        const newErrors = {};
        if (!description) newErrors.description = 'Description is required';
        if (!amount) newErrors.amount = 'Amount is required';
        if (parseFloat(amount) <= 0) newErrors.amount = 'Amount must be greater than zero';
        if (!date) newErrors.date = 'Date is required';
        if (!category) newErrors.category = 'Category is required';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
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
        setErrors({});
    };

    return (
        <div className="card shadow-sm rounded-3">
            <div className="card-header bg-primary text-white text-center py-3">
                <h4 className="mb-0">
                    {editingExpense ? 'Edit Expense' : 'Add Expense'}
                </h4>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            className="form-control"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g., Groceries, Dinner"
                        />
                        {errors.description && <div className="text-danger mt-1">{errors.description}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            className="form-control"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g., ₹50.00"
                        />
                        {errors.amount && <div className="text-danger mt-1">{errors.amount}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        {errors.date && <div className="text-danger mt-1">{errors.date}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            className="form-select"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select a category</option>
                            <option value="FOOD">Food</option>
                            <option value="HEALTH">Health</option>
                            <option value="CLOTHING">Clothing</option>
                            <option value="TRAVEL">Travel</option>
                            <option value="BILLS">Bills</option>
                            <option value="OTHERS">Others</option>
                        </select>
                        {errors.category && <div className="text-danger mt-1">{errors.category}</div>}
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        {editingExpense ? 'Update' : 'Add'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ExpenseForm;
