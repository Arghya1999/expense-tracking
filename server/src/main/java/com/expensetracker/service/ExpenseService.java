package com.expensetracker.service;

import com.expensetracker.model.Expense;
import com.expensetracker.model.User;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseService {
    List<Expense> getAllExpenses(User user, LocalDate startDate, LocalDate endDate);
    Expense getExpenseById(User user, Long id);
    Expense createExpense(Expense expense);
    Expense updateExpense(User user, Long id, Expense expenseDetails);
    void deleteExpense(User user, Long id);
}