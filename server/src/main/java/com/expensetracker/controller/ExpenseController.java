
package com.expensetracker.controller;

import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.service.ExpenseService;
import com.expensetracker.security.services.UserDetailsImpl;
import com.expensetracker.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@SecurityRequirement(name = "bearerAuth")
public class ExpenseController {

    private static final Logger logger = LoggerFactory.getLogger(ExpenseController.class);

    private final ExpenseService expenseService;
    private final UserRepository userRepository;

    public ExpenseController(ExpenseService expenseService, UserRepository userRepository) {
        this.expenseService = expenseService;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
    }

    @GetMapping
    public List<Expense> getAllExpenses(@RequestParam(required = false) LocalDate startDate, @RequestParam(required = false) LocalDate endDate) {
        User currentUser = getCurrentUser();
        logger.info("Fetching all expenses for user {} with startDate: {} and endDate: {}", currentUser.getId(), startDate, endDate);
        List<Expense> expenses = expenseService.getAllExpenses(currentUser, startDate, endDate);
        logger.debug("Found {} expenses for user {}.", expenses.size(), currentUser.getId());
        return expenses;
    }

    @PostMapping
    public Expense createExpense(@RequestBody Expense expense) {
        // User will be set in ExpenseServiceImpl
        logger.info("Creating new expense: {}", expense.getDescription());
        Expense createdExpense = expenseService.createExpense(expense);
        logger.debug("Expense created with ID: {}", createdExpense.getId());
        return createdExpense;
    }

    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense expenseDetails) {
        User currentUser = getCurrentUser();
        logger.info("Updating expense with ID {} for user {}.", id, currentUser.getId());
        Expense updatedExpense = expenseService.updateExpense(currentUser, id, expenseDetails);
        logger.debug("Expense with ID {} updated successfully for user {}.", updatedExpense.getId(), currentUser.getId());
        return updatedExpense;
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        logger.info("Deleting expense with ID {} for user {}.", id, currentUser.getId());
        expenseService.deleteExpense(currentUser, id);
        logger.debug("Expense with ID {} deleted successfully for user {}.", id, currentUser.getId());
    }
}
