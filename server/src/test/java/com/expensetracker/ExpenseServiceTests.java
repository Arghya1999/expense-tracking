package com.expensetracker;

import com.expensetracker.controller.ExpenseController;
import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ExpenseServiceTests {

    @Mock
    private ExpenseRepository expenseRepository;

    @InjectMocks
    private ExpenseController expenseController;

    private Expense expense1;
    private Expense expense2;

    @BeforeEach
    void setUp() {
        expense1 = new Expense();
        expense1.setId(1L);
        expense1.setDescription("Groceries");
        expense1.setAmount(50.0);
        expense1.setCategory("Food");
        expense1.setDate(LocalDate.of(2023, 1, 15));

        expense2 = new Expense();
        expense2.setId(2L);
        expense2.setDescription("Dinner");
        expense2.setAmount(30.0);
        expense2.setCategory("Food");
        expense2.setDate(LocalDate.of(2023, 1, 20));
    }

    @Test
    void testGetAllExpenses() {
        when(expenseRepository.findAll()).thenReturn(Arrays.asList(expense1, expense2));

        List<Expense> expenses = expenseController.getAllExpenses(null, null);

        assertEquals(2, expenses.size());
        assertEquals("Groceries", expenses.get(0).getDescription());
    }

    @Test
    void testGetAllExpensesWithStartDateAndEndDate() {
        LocalDate startDate = LocalDate.of(2023, 1, 10);
        LocalDate endDate = LocalDate.of(2023, 1, 25);
        when(expenseRepository.findByDateBetween(startDate, endDate)).thenReturn(Arrays.asList(expense1, expense2));

        List<Expense> expenses = expenseController.getAllExpenses(startDate, endDate);

        assertEquals(2, expenses.size());
    }

    @Test
    void testCreateExpense() {
        when(expenseRepository.save(any(Expense.class))).thenReturn(expense1);

        Expense createdExpense = expenseController.createExpense(expense1);

        assertEquals("Groceries", createdExpense.getDescription());
    }

    @Test
    void testUpdateExpense() {
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(expense1));
        when(expenseRepository.save(any(Expense.class))).thenReturn(expense1);

        expense1.setDescription("Updated Groceries");
        Expense updatedExpense = expenseController.updateExpense(1L, expense1);

        assertEquals("Updated Groceries", updatedExpense.getDescription());
    }

    @Test
    void testUpdateExpenseNotFound() {
        when(expenseRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            expenseController.updateExpense(1L, expense1);
        });
    }

    @Test
    void testDeleteExpense() {
        doNothing().when(expenseRepository).deleteById(1L);

        expenseController.deleteExpense(1L);

        verify(expenseRepository, times(1)).deleteById(1L);
    }
}
