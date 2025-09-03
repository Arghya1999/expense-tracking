import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseList from '../components/expenses/ExpenseList';
import { getExpenses, createExpense, updateExpense } from '../services/api';
import { logout } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Typography,
    Spinner
} from "@material-tailwind/react";

const ExpensesPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [editingExpense, setEditingExpense] = useState(null);
    const [totalExpense, setTotalExpense] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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
        setLoading(true);
        setError(null);
        getExpenses(start, end).then(response => {
            setExpenses(response.data);
            setLoading(false);
        }).catch(err => {
            setError('Failed to fetch expenses. Please try again later.');
            setLoading(false);
            if (err.response && err.response.status === 401) {
                logout();
                navigate("/login");
            }
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
        <div className="container mx-auto py-4">
            <Card className="mb-4 shadow-xl bg-white dark:bg-gray-800 rounded-lg">
                <CardHeader
                    variant="gradient"
                    color="blue"
                    className="mb-4 grid h-20 place-items-center rounded-t-lg"
                >
                    <Typography variant="h4" color="white">
                        Total Expense: ₹{totalExpense.toFixed(2)}
                    </Typography>
                </CardHeader>
                <CardBody className="flex flex-col md:flex-row items-end justify-center gap-4 p-6">
                    <div className="w-full md:w-1/3">
                        <Input
                            id="start-date"
                            data-testid="start-date-input"
                            label="Start Date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="dark:text-white"
                            labelProps={{ className: "dark:text-gray-300" }}
                        />
                    </div>
                    <div className="w-full md:w-1/3">
                        <Input
                            id="end-date"
                            data-testid="end-date-input"
                            label="End Date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="dark:text-white"
                            labelProps={{ className: "dark:text-gray-300" }}
                        />
                    </div>
                    <div className="w-full md:w-1/6">
                        <Button color="blue" fullWidth onClick={handleSearch}>
                            <span className="dark:text-white">Search</span>
                        </Button>
                    </div>
                </CardBody>
            </Card>

            {error && <Typography color="red" className="text-center mb-4">{error}</Typography>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <ExpenseForm
                        onExpenseCreated={handleExpenseCreated}
                        editingExpense={editingExpense}
                        onExpenseUpdated={handleExpenseUpdated}
                    />
                </div>
                <div>
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <Spinner className="h-12 w-12" data-testid="loading-spinner" />
                        </div>
                    ) : (
                        <ExpenseList expenses={expenses} fetchExpenses={fetchExpenses} onEdit={handleEdit} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExpensesPage;