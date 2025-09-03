import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Select,
    Option,
    Typography,
} from "@material-tailwind/react";

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
        <Card className="w-full shadow-xl bg-white dark:bg-gray-800 rounded-lg">
            <CardHeader
                variant="gradient"
                color="blue"
                className="mb-4 grid h-20 place-items-center rounded-t-lg"
            >
                <Typography variant="h4" color="white">
                    {editingExpense ? 'Edit Expense' : 'Add Expense'}
                </Typography>
            </CardHeader>
            <CardBody className="p-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Description"
                        id="description"
                        data-testid="expense-description-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        error={!!errors.description}
                        className="dark:text-white"
                        labelProps={{ className: "dark:text-gray-300" }}
                    />
                    {errors.description && <span className="text-red-500">{errors.description}</span>}
                    <Input
                        label="Amount"
                        id="amount"
                        type="number"
                        data-testid="expense-amount-input"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        error={!!errors.amount}
                        className="dark:text-white"
                        labelProps={{ className: "dark:text-gray-300" }}
                    />
                    {errors.amount && <span className="text-red-500">{errors.amount}</span>}
                    <Input
                        label="Date"
                        id="date"
                        type="date"
                        data-testid="expense-date-input"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        error={!!errors.date}
                        className="dark:text-white"
                        labelProps={{ className: "dark:text-gray-300" }}
                    />
                    {errors.date && <span className="text-red-500">{errors.date}</span>}
                    <Select
                        label="Category"
                        id="category"
                        data-testid="expense-category-select"
                        value={category}
                        onChange={(value) => setCategory(value)}
                        error={!!errors.category}
                        className="dark:text-white"
                        labelProps={{ className: "dark:text-gray-300" }}
                    >
                        <Option value="FOOD" className="dark:text-white">Food</Option>
                        <Option value="HEALTH" className="dark:text-white">Health</Option>
                        <Option value="CLOTHING" className="dark:text-white">Clothing</Option>
                        <Option value="TRAVEL" className="dark:text-white">Travel</Option>
                        <Option value="BILLS" className="dark:text-white">Bills</Option>
                        <Option value="OTHERS" className="dark:text-white">Others</Option>
                    </Select>
                    {errors.category && <span className="text-red-500">{errors.category}</span>}
                    <Button type="submit" color="blue" fullWidth>
                        <span className="dark:text-white">{editingExpense ? 'Update' : 'Add'}</span>
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
};

ExpenseForm.propTypes = {
    onExpenseCreated: PropTypes.func.isRequired,
    editingExpense: PropTypes.shape({
        id: PropTypes.number,
        description: PropTypes.string,
        amount: PropTypes.number,
        category: PropTypes.string,
        date: PropTypes.string,
    }),
    onExpenseUpdated: PropTypes.func.isRequired,
};

ExpenseForm.defaultProps = {
    editingExpense: null,
};

export default ExpenseForm;