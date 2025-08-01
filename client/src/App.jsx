import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import ExpenseList from './components/ExpenseList.jsx';
import ExpenseForm from './components/ExpenseForm.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import { getExpenses, createExpense, updateExpense } from './services/api';
import { getCurrentUser, logout } from './services/auth.service';
import './App.css';

function App() {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [expenses, setExpenses] = useState([]);
    const [editingExpense, setEditingExpense] = useState(null);
    const [totalExpense, setTotalExpense] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            setCurrentUser(user);
            fetchExpenses(); // Fetch expenses only if user is logged in
        }
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
            // Handle error, e.g., redirect to login if unauthorized
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

    const logOut = () => {
        logout();
        setCurrentUser(undefined);
        navigate("/login");
    };

    return (
        <div className="container-fluid p-0">
            <header className="bg-white shadow-sm py-3 mb-4">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="h3 mb-0 text-primary">Expense Tracker</h1>
                    {currentUser && (
                        <nav className="navbar navbar-expand-lg navbar-light">
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li className="nav-item">
                                        <Link to={"/expenses"} className="nav-link active" aria-current="page">
                                            Expenses
                                        </Link>
                                    </li>
                                </ul>
                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <a href="/login" className="nav-link btn btn-outline-danger btn-sm" onClick={logOut}>
                                            LogOut
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    )}

                    {!currentUser && (
                        <nav className="navbar navbar-expand-lg navbar-light">
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <Link to={"/login"} className="nav-link btn btn-outline-primary btn-sm me-2">
                                            Login
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={"/register"} className="nav-link btn btn-primary btn-sm">
                                            Sign Up
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    )}
                </div>
            </header>
            <main className="container py-4">
                {currentUser && (
                    <div className="card p-4 mb-4 shadow-sm">
                        <h3 className="mb-3 text-center">Total Expense: <span className="text-primary">₹{totalExpense.toFixed(2)}</span></h3>
                        <div className="row g-3 align-items-end justify-content-center">
                            <div className="col-md-4">
                                <label htmlFor="startDate" className="form-label">Start Date:</label>
                                <input type="date" className="form-control" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="endDate" className="form-label">End Date:</label>
                                <input type="date" className="form-control" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                            <div className="col-md-2 d-grid">
                                <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                            </div>
                        </div>
                    </div>
                )}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/expenses" element={
                        currentUser ? (
                            <div className="row justify-content-center">
                                <div className="col-md-6 mb-4">
                                    <ExpenseForm
                                        onExpenseCreated={handleExpenseCreated}
                                        editingExpense={editingExpense}
                                        onExpenseUpdated={handleExpenseUpdated}
                                    />
                                </div>
                                <div className="col-md-6 mb-4">
                                    <ExpenseList expenses={expenses} fetchExpenses={fetchExpenses} onEdit={handleEdit} />
                                </div>
                            </div>
                        ) : (
                            <Login />
                        )
                    } />
                    <Route path="/" element={currentUser ? <div className="row justify-content-center">
                        <div className="col-md-6 mb-4">
                            <ExpenseForm
                                onExpenseCreated={handleExpenseCreated}
                                editingExpense={editingExpense}
                                onExpenseUpdated={handleExpenseUpdated}
                            />
                        </div>
                        <div className="col-md-6 mb-4">
                            <ExpenseList expenses={expenses} fetchExpenses={fetchExpenses} onEdit={handleEdit} />
                        </div>
                    </div> : <Login />} />
                </Routes>
            </main>

            <footer className="bg-dark text-white py-4 mt-5">
                <div className="container text-center">
                    <div className="row">
                        <div className="col-md-4 mb-3 mb-md-0">
                            <h5>Contact Us</h5>
                            <p className="mb-0">Mobile: 9734187531</p>
                            <p className="mb-0">Email: panarghya2015@gmail.com</p>
                        </div>
                        <div className="col-md-4 mb-3 mb-md-0">
                            <h5>Pan Company</h5>
                            <p className="mb-0">&copy; {new Date().getFullYear()} Pan. All rights reserved.</p>
                        </div>
                        <div className="col-md-4">
                            <h5>About Us</h5>
                            <p className="mb-0">Your go-to solution for tracking and managing personal expenses efficiently.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
