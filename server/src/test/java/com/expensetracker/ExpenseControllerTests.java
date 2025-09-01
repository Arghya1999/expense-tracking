package com.expensetracker;

import com.expensetracker.controller.ExpenseController;
import com.expensetracker.exception.ExpenseNotFoundException;
import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.services.UserDetailsImpl;
import com.expensetracker.service.ExpenseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ExpenseControllerTests {

    @Mock
    private ExpenseService expenseService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private ExpenseController expenseController;

    private Expense expense1;
    private Expense expense2;
    private User testUser;

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

        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        // Mock SecurityContextHolder
        Mockito.lenient().when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        Mockito.lenient().when(authentication.getPrincipal()).thenReturn(UserDetailsImpl.build(testUser));

        // Mock UserRepository
        Mockito.lenient().when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
    }

    @Test
    void testGetAllExpenses() {
        when(expenseService.getAllExpenses(any(User.class), eq(null), eq(null))).thenReturn(Arrays.asList(expense1, expense2));

        List<Expense> expenses = expenseController.getAllExpenses(null, null);

        assertEquals(2, expenses.size());
        assertEquals("Groceries", expenses.get(0).getDescription());
    }

    @Test
    void testGetAllExpensesWithStartDateAndEndDate() {
        LocalDate startDate = LocalDate.of(2023, 1, 10);
        LocalDate endDate = LocalDate.of(2023, 1, 25);
        when(expenseService.getAllExpenses(any(User.class), eq(startDate), eq(endDate))).thenReturn(Arrays.asList(expense1, expense2));

        List<Expense> expenses = expenseController.getAllExpenses(startDate, endDate);

        assertEquals(2, expenses.size());
    }

    @Test
    void testCreateExpense() {
        when(expenseService.createExpense(any(Expense.class))).thenReturn(expense1);

        Expense createdExpense = expenseController.createExpense(expense1);

        assertEquals("Groceries", createdExpense.getDescription());
    }

    @Test
    void testUpdateExpense() {
        when(expenseService.updateExpense(any(User.class), any(Long.class), any(Expense.class))).thenReturn(expense1);

        expense1.setDescription("Updated Groceries");
        Expense updatedExpense = expenseController.updateExpense(1L, expense1);

        assertEquals("Updated Groceries", updatedExpense.getDescription());
    }

    @Test
    void testUpdateExpenseNotFound() {
        when(expenseService.updateExpense(any(User.class), any(Long.class), any(Expense.class)))
                .thenThrow(new ExpenseNotFoundException("Expense not found with id: 1"));

        assertThrows(ExpenseNotFoundException.class, () -> {
            expenseController.updateExpense(1L, expense1);
        });
    }

    @Test
    void testDeleteExpense() {
        doNothing().when(expenseService).deleteExpense(any(User.class), eq(1L));

        expenseController.deleteExpense(1L);

        verify(expenseService, times(1)).deleteExpense(any(User.class), eq(1L));
    }
}
