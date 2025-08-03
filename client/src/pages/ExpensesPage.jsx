import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseList from '../components/expenses/ExpenseList';
import { getExpenses, createExpense, updateExpense } from '../services/api';
import { logout } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';


const ExpensesPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [editingExpense, setEditingExpense] = useState(null);
    const [totalExpense, setTotalExpense] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchExpenses();
    }, []);

    useEffect(() => {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalExpense(total);
    }, [expenses]);

    const handleSearch = () => {
        fetchExpenses(startDate, endDate);
    };

    const fetchExpenses = (start = '', end = '') => {
        getExpenses(start, end).then(response => {
            setExpenses(response.data);
        }).catch(() => {
            logout();
            navigate("/login");
        });
    };

    const handleExpenseCreated = (expense) => {
        createExpense(expense).then(() => {
            fetchExpenses();
        });
    };

    const handleExpenseUpdated = (id, expense) => {
        updateExpense(id, expense).then(() => {
            fetchExpenses();
            setEditingExpense(null);
        });
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
    };

    return (
        <div className="container py-4">
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-primary text-white text-center py-3">
                    <h4 className="mb-0">
                        Total Expense: ₹{totalExpense.toFixed(2)}
                    </h4>
                </div>
                <div className="card-body d-flex flex-column flex-md-row align-items-end justify-content-center gap-4">
                    <div className="w-100 w-md-33">
                        <div className="form-group">
                            <label htmlFor="startDate" className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-100 w-md-33">
                        <div className="form-group">
                            <label htmlFor="endDate" className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-100 w-md-16">
                        <button className="btn btn-primary w-100" onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center g-4">
                <div className="col-md-6">
                    <ExpenseForm
                        onExpenseCreated={handleExpenseCreated}
                        editingExpense={editingExpense}
                        onExpenseUpdated={handleExpenseUpdated}
                    />
                </div>
                <div className="col-md-6">
                    <ExpenseList expenses={expenses} fetchExpenses={fetchExpenses} onEdit={handleEdit} />
                </div>
            </div>
        </div>
    );
};

export default ExpensesPage;