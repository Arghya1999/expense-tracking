
import React from 'react';
import { deleteExpense } from '../../services/api';
import {
    Card,
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
        <Card className="w-full shadow-xl bg-white rounded-lg">
            <CardHeader
                variant="gradient"
                color="primary"
                className="mb-4 grid h-20 place-items-center rounded-t-lg"
            >
                <Typography variant="h4" color="white">
                    Expenses
                </Typography>
            </CardHeader>
            <List className="p-0">
                {expenses.length === 0 ? (
                    <Typography className="text-center py-4 text-secondary-500">No expenses to display.</Typography>
                ) : (
                    expenses.map(expense => (
                        <ListItem key={expense.id} className="flex flex-col md:flex-row justify-between items-start md:items-center py-3 px-4 border-b border-secondary-50 last:border-b-0 hover:bg-secondary-50">
                            <div className="flex-grow mb-2 md:mb-0">
                                <Typography variant="h6" color="secondary-800" className="mb-1">{expense.description}</Typography>
                                <div className="flex items-center gap-2">
                                    <Chip value={expense.category} size="sm" variant="filled" color="primary" />
                                    <Typography variant="small" color="secondary-600" className="text-secondary-600">{expense.date}</Typography>
                                </div>
                            </div>
                            <ListItemSuffix className="flex items-center gap-2 mt-2 md:mt-0">
                                <Typography variant="h6" color="green">₹{expense.amount.toFixed(2)}</Typography>
                                <IconButton variant="text" color="primary" onClick={() => onEdit(expense)}>
                                    <PencilIcon className="h-5 w-5" />
                                </IconButton>
                                <IconButton variant="text" color="red" onClick={() => handleDelete(expense.id)}>
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

export default ExpenseList;

