package com.expensetracker.service;

import com.expensetracker.exception.ExpenseNotFoundException;
import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.repository.ExpenseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private static final Logger logger = LoggerFactory.getLogger(ExpenseServiceImpl.class);

    private final ExpenseRepository expenseRepository;
    private final UserService userService;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository, UserService userService) {
        this.expenseRepository = expenseRepository;
        this.userService = userService;
    }

    @Override
    @Cacheable(value = "expenses", key = "#user.id + ':' + T(java.util.Objects).toString(#startDate) + ':' + T(java.util.Objects).toString(#endDate)")
    public List<Expense> getAllExpenses(User user, LocalDate startDate, LocalDate endDate) {
        logger.info("Fetching all expenses from service for user {} with startDate: {} and endDate: {}", user.getId(), startDate, endDate);
        if (startDate != null && endDate != null) {
            List<Expense> expenses = expenseRepository.findByUserAndDateBetween(user, startDate, endDate);
            logger.debug("Found {} expenses for user {} between {} and {}.", expenses.size(), user.getId(), startDate, endDate);
            return expenses;
        } else if (startDate != null) {
            List<Expense> expenses = expenseRepository.findByUserAndDateAfter(user, startDate);
            logger.debug("Found {} expenses for user {} after {}.", expenses.size(), user.getId(), startDate);
            return expenses;
        } else if (endDate != null) {
            List<Expense> expenses = expenseRepository.findByUserAndDateBefore(user, endDate);
            logger.debug("Found {} expenses for user {} before {}.", expenses.size(), user.getId(), endDate);
            return expenses;
        } else {
            List<Expense> expenses = expenseRepository.findByUser(user);
            logger.debug("Found {} total expenses for user {}.", expenses.size(), user.getId());
            return expenses;
        }
    }

    @Override
    @Cacheable(value = "expense", key = "#user.id + ':' + #id")
    public Expense getExpenseById(User user, Long id) {
        logger.info("Fetching expense by ID {} for user {} from service.", id, user.getId());
        return expenseRepository.findById(id)
                .filter(expense -> expense.getUser().equals(user)) // Ensure expense belongs to user
                .orElseThrow(() -> new ExpenseNotFoundException("Expense not found with id: " + id + " for user: " + user.getId()));
    }

    @Override
    @CacheEvict(value = "expenses", allEntries = true) // Still clearing all for simplicity, but ideally more granular
    @CachePut(value = "expense", key = "#expense.user.id + ':' + #expense.id")
    public Expense createExpense(Expense expense) {
        User currentUser = userService.getCurrentUser();
        expense.setUser(currentUser); // Set user before saving
        logger.info("Creating new expense from service for user {}: {}", currentUser.getId(), expense.getDescription());
        Expense createdExpense = expenseRepository.save(expense);
        logger.debug("Expense created with ID: {} for user {}.", createdExpense.getId(), currentUser.getId());
        return createdExpense;
    }

    @Override
    @CacheEvict(value = "expenses", allEntries = true) // Still clearing all for simplicity, but ideally more granular
    @CachePut(value = "expense", key = "#user.id + ':' + #id")
    public Expense updateExpense(User user, Long id, Expense expenseDetails) {
        logger.info("Updating expense from service with ID {} for user {}.", id, user.getId());
        Expense expense = expenseRepository.findById(id)
                .filter(exp -> exp.getUser().equals(user)) // Ensure expense belongs to user
                .orElseThrow(() -> {
                    logger.warn("Expense not found with ID {} for user {}.", id, user.getId());
                    return new ExpenseNotFoundException("Expense not found with id: " + id + " for user: " + user.getId());
                });
        expense.setDescription(expenseDetails.getDescription());
        expense.setAmount(expenseDetails.getAmount());
        expense.setCategory(expenseDetails.getCategory());
        expense.setDate(expenseDetails.getDate());
        Expense updatedExpense = expenseRepository.save(expense);
        logger.debug("Expense with ID {} updated successfully for user {}.", updatedExpense.getId(), user.getId());
        return updatedExpense;
    }

    @Override
    @CacheEvict(value = {"expense", "expenses"}, key = "#user.id + ':' + #id", allEntries = true) // Still clearing all for simplicity, but ideally more granular
    public void deleteExpense(User user, Long id) {
        logger.info("Deleting expense from service with ID {} for user {}.", id, user.getId());
        Expense expense = expenseRepository.findById(id)
                .filter(exp -> exp.getUser().equals(user)) // Ensure expense belongs to user
                .orElseThrow(() -> {
                    logger.warn("Expense not found with ID {} for user {}.", id, user.getId());
                    return new ExpenseNotFoundException("Expense not found with id: " + id + " for user: " + user.getId());
                });
        expenseRepository.delete(expense);
        logger.debug("Expense with ID {} deleted successfully for user {}.", id, user.getId());
    }
}
