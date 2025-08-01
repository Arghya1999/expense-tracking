
package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByDate(LocalDate date);
    List<Expense> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<Expense> findByDateAfter(LocalDate date);
    List<Expense> findByDateBefore(LocalDate date);
}
