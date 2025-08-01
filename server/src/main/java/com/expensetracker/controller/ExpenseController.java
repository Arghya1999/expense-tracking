
package com.expensetracker.controller;

import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")

public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @GetMapping
    public List<Expense> getAllExpenses(@RequestParam(required = false) LocalDate startDate, @RequestParam(required = false) LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return expenseRepository.findByDateBetween(startDate, endDate);
        } else if (startDate != null) {
            return expenseRepository.findByDateAfter(startDate);
        } else if (endDate != null) {
            return expenseRepository.findByDateBefore(endDate);
        } else {
            return expenseRepository.findAll();
        }
    }

    @PostMapping
    public Expense createExpense(@RequestBody Expense expense) {
        return expenseRepository.save(expense);
    }

    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense expenseDetails) {
        Expense expense = expenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
        expense.setDescription(expenseDetails.getDescription());
        expense.setAmount(expenseDetails.getAmount());
        expense.setCategory(expenseDetails.getCategory());
        expense.setDate(expenseDetails.getDate());
        return expenseRepository.save(expense);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseRepository.deleteById(id);
    }
}
