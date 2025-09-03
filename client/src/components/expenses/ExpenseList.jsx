import React from 'react';
import PropTypes from 'prop-types';
import { deleteExpense } from '../../services/api';
import {
    Card,
    CardHeader,
    Typography,
    List,
    ListItem,
    ListItemSuffix,
    IconButton,
    Chip,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const ExpenseList = ({ expenses, fetchExpenses, onEdit }) => {

    const handleDelete = (id) => {
        deleteExpense(id).then(() => {
            fetchExpenses();
        });
    };

    return (
        <Card className="w-full shadow-xl bg-white dark:bg-gray-800 rounded-lg">
            <CardHeader
                variant="gradient"
                color="blue"
                className="mb-4 grid h-20 place-items-center rounded-t-lg"
            >
                <Typography variant="h4" color="white">
                    Expenses
                </Typography>
            </CardHeader>
            <List className="p-0">
                {expenses.length === 0 ? (
                    <Typography className="text-center py-4 text-gray-500 dark:text-gray-400">No expenses to display.</Typography>
                ) : (
                    expenses.map(expense => (
                        <ListItem key={expense.id} className="flex flex-col md:flex-row justify-between items-start md:items-center py-3 px-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <div className="flex-grow mb-2 md:mb-0">
                                <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-white">{expense.description}</Typography>
                                <div className="flex items-center gap-2">
                                    <Chip value={expense.category} size="sm" variant="filled" color="blue" />
                                    <Typography variant="small" color="gray" className="text-gray-600 dark:text-gray-400">{expense.date}</Typography>
                                </div>
                            </div>
                            <ListItemSuffix className="flex items-center gap-2 mt-2 md:mt-0">
                                <Typography variant="h6" color="green" className="dark:text-green-400">₹{expense.amount.toFixed(2)}</Typography>
                                <IconButton variant="text" color="blue" onClick={() => onEdit(expense)} className="dark:text-white" data-testid={`edit-button-${expense.id}`}>
                                    <PencilIcon className="h-5 w-5" />
                                </IconButton>
                                <IconButton variant="text" color="red" onClick={() => handleDelete(expense.id)} className="dark:text-red-400" data-testid={`delete-button-${expense.id}`}>
                                    <TrashIcon className="h-5 w-5" />
                                </IconButton>
                            </ListItemSuffix>
                        </ListItem>
                    ))
                )}
            </List>
        </Card>
    );
};

ExpenseList.propTypes = {
    expenses: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        category: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
    })).isRequired,
    fetchExpenses: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default ExpenseList;